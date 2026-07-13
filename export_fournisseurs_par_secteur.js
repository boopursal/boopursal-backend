/**
 * EXPORT FOURNISSEURS PAR SECTEUR, SOUS-SECTEUR & CATÉGORIE
 * ==========================================================
 * Génère deux fichiers dans ./exports/ :
 *   - fournisseurs_par_secteur.csv
 *   - fournisseurs_par_secteur.json
 *
 * Usage : node export_fournisseurs_par_secteur.js
 */

const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function main() {
    console.log('🔌 Connexion à la base de données...');

    // ── 1. Récupérer tous les secteurs actifs ──────────────────────────────────
    const secteurs = await prisma.secteur.findMany({
        where: { del: false },
        orderBy: { name: 'asc' },
        include: {
            sous_secteur: {
                where: { del: false },
                orderBy: { name: 'asc' },
                include: {
                    categorie_sous_secteur: {
                        include: {
                            categorie: {
                                include: {
                                    fournisseur_categories: {
                                        include: {
                                            fournisseur: {
                                                include: {
                                                    user: {
                                                        select: {
                                                            email: true,
                                                            phone: true,
                                                            first_name: true,
                                                            last_name: true,
                                                            isactif: true,
                                                            created: true,
                                                        }
                                                    },
                                                    pays: { select: { name: true } },
                                                    ville: { select: { name: true } },
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    });

    console.log(`✅ ${secteurs.length} secteurs récupérés.`);

    // ── 2. Construire les données structurées ──────────────────────────────────
    const rows = [];     // Pour le CSV (plat)
    const jsonOutput = []; // Pour le JSON (hiérarchique)

    for (const secteur of secteurs) {
        const secteurJson = {
            secteur_id: secteur.id,
            secteur_name: secteur.name,
            secteur_slug: secteur.slug,
            sous_secteurs: []
        };

        for (const ss of secteur.sous_secteur) {
            const sousSecteurJson = {
                sous_secteur_id: ss.id,
                sous_secteur_name: ss.name,
                sous_secteur_slug: ss.slug,
                categories: []
            };

            // Trier les catégories par nom
            const sortedCss = [...ss.categorie_sous_secteur].sort((a, b) =>
                a.categorie.name.localeCompare(b.categorie.name, 'fr')
            );

            for (const css of sortedCss) {
                const cat = css.categorie;
                if (cat.del) continue;

                const fournisseurs = cat.fournisseur_categories.map(fc => {
                    const f = fc.fournisseur;
                    return {
                        id: f.id,
                        societe: f.societe || '',
                        slug: f.slug || '',
                        email: f.user?.email || '',
                        telephone: f.user?.phone || '',
                        prenom: f.user?.first_name || '',
                        nom: f.user?.last_name || '',
                        pays: f.pays?.name || '',
                        ville: f.ville?.name || f.autre_ville || '',
                        website: f.website || '',
                        ice: f.ice || '',
                        is_complet: f.is_complet ? 'Oui' : 'Non',
                        compte_actif: f.user?.isactif ? 'Oui' : 'Non',
                        date_inscription: f.user?.created
                            ? new Date(f.user.created).toLocaleDateString('fr-FR')
                            : '',
                    };
                });

                // Ajouter au JSON
                sousSecteurJson.categories.push({
                    categorie_id: cat.id,
                    categorie_name: cat.name,
                    categorie_slug: cat.slug,
                    nb_fournisseurs: fournisseurs.length,
                    fournisseurs
                });

                // Ajouter au CSV (une ligne par fournisseur dans cette catégorie)
                if (fournisseurs.length === 0) {
                    rows.push({
                        secteur: secteur.name,
                        sous_secteur: ss.name,
                        categorie: cat.name,
                        id_fournisseur: '',
                        societe: '(aucun fournisseur)',
                        prenom: '', nom: '', email: '', telephone: '',
                        pays: '', ville: '', website: '', ice: '',
                        compte_actif: '', is_complet: '', date_inscription: ''
                    });
                } else {
                    for (const f of fournisseurs) {
                        rows.push({
                            secteur: secteur.name,
                            sous_secteur: ss.name,
                            categorie: cat.name,
                            id_fournisseur: f.id,
                            societe: f.societe,
                            prenom: f.prenom,
                            nom: f.nom,
                            email: f.email,
                            telephone: f.telephone,
                            pays: f.pays,
                            ville: f.ville,
                            website: f.website,
                            ice: f.ice,
                            compte_actif: f.compte_actif,
                            is_complet: f.is_complet,
                            date_inscription: f.date_inscription,
                        });
                    }
                }
            }

            secteurJson.sous_secteurs.push(sousSecteurJson);
        }

        jsonOutput.push(secteurJson);
    }

    // ── 3. Créer le dossier exports/ ──────────────────────────────────────────
    const exportDir = path.join(__dirname, 'exports');
    if (!fs.existsSync(exportDir)) {
        fs.mkdirSync(exportDir, { recursive: true });
    }

    // ── 4. Écrire le fichier JSON ──────────────────────────────────────────────
    const jsonPath = path.join(exportDir, 'fournisseurs_par_secteur.json');
    fs.writeFileSync(jsonPath, JSON.stringify(jsonOutput, null, 2), 'utf8');
    console.log(`📄 JSON créé : ${jsonPath}`);

    // ── 5. Écrire le fichier CSV ───────────────────────────────────────────────
    const csvPath = path.join(exportDir, 'fournisseurs_par_secteur.csv');
    const headers = [
        'Secteur', 'Sous-Secteur', 'Catégorie', 'ID Fournisseur', 'Société',
        'Prénom', 'Nom', 'Email', 'Téléphone',
        'Pays', 'Ville', 'Site Web', 'ICE',
        'Compte Actif', 'Profil Complet', 'Date Inscription'
    ];

    const escape = (val) => {
        if (val === null || val === undefined) return '';
        const s = String(val).replace(/\r?\n/g, ' ').replace(/"/g, '""');
        return s.includes(',') || s.includes('"') || s.includes('\n') ? `"${s}"` : s;
    };

    const csvLines = [
        headers.join(','),
        ...rows.map(r => [
            escape(r.secteur),
            escape(r.sous_secteur),
            escape(r.categorie),
            escape(r.id_fournisseur),
            escape(r.societe),
            escape(r.prenom),
            escape(r.nom),
            escape(r.email),
            escape(r.telephone),
            escape(r.pays),
            escape(r.ville),
            escape(r.website),
            escape(r.ice),
            escape(r.compte_actif),
            escape(r.is_complet),
            escape(r.date_inscription),
        ].join(','))
    ];

    fs.writeFileSync(csvPath, '\uFEFF' + csvLines.join('\r\n'), 'utf8'); // BOM + CRLF pour Excel
    console.log(`📊 CSV créé : ${csvPath}`);

    // ── 6. Résumé ──────────────────────────────────────────────────────────────
    console.log('\n══════════════════════════════════════════════════════════════');
    console.log('📈 RÉSUMÉ DE L\'EXPORT  (secteur → ss / cats / fournisseurs)');
    console.log('══════════════════════════════════════════════════════════════');

    let totalCategories = 0;
    for (const s of jsonOutput) {
        const nbCats = s.sous_secteurs.reduce((a, ss) => a + ss.categories.length, 0);
        const uniqueFrs = new Set(
            s.sous_secteurs.flatMap(ss =>
                ss.categories.flatMap(cat => cat.fournisseurs.map(f => f.id))
            )
        ).size;
        totalCategories += nbCats;
        console.log(`  📁 ${s.secteur_name.padEnd(42)} → ${String(s.sous_secteurs.length).padStart(2)} ss / ${String(nbCats).padStart(3)} cats / ${String(uniqueFrs).padStart(3)} frs`);
    }

    console.log('──────────────────────────────────────────────────────────────');
    console.log(`  📊 Total lignes CSV      : ${rows.length}`);
    console.log(`  🏢 Total secteurs        : ${jsonOutput.length}`);
    console.log(`  📂 Total catégories      : ${totalCategories}`);
    console.log('\n✅ Export terminé avec succès !');
    console.log(`   → ${csvPath}`);
    console.log(`   → ${jsonPath}`);
}


main()
    .catch(err => {
        console.error('❌ Erreur :', err.message);
        process.exit(1);
    })
    .finally(() => prisma.$disconnect());
