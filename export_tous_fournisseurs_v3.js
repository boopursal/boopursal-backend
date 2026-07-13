const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');

const prisma = new PrismaClient();

async function main() {
    console.log('🔌 Connexion à la base de données...');

    // Récupérer TOUS les fournisseurs (sans filtrer par catégorie)
    const fournisseurs = await prisma.fournisseur.findMany({
        include: {
            user: {
                select: {
                    email: true,
                    phone: true,
                    first_name: true,
                    last_name: true,
                    isactif: true,
                    created: true,
                    del: true
                }
            },
            pays: { select: { name: true } },
            ville: { select: { name: true } },
        }
    });

    console.log(`✅ ${fournisseurs.length} fournisseurs trouvés au total dans la base.`);

    // Filtrer les comptes non supprimés (del: false)
    const activeFournisseurs = fournisseurs.filter(f => !f.user || f.user.del === false);

    // Trier par nom de société
    const sorted = activeFournisseurs.sort((a, b) => {
        const sA = a.societe || 'ZZZ'; // Mettre ceux sans société à la fin
        const sB = b.societe || 'ZZZ';
        return sA.localeCompare(sB, 'fr');
    });

    const exportDir = path.join(__dirname, 'exports');
    if (!fs.existsSync(exportDir)) {
        fs.mkdirSync(exportDir, { recursive: true });
    }

    const pdfPath = path.join(exportDir, 'tous_les_fournisseurs_v3.pdf');
    const doc = new PDFDocument({ margin: 40, size: 'A4' });
    doc.pipe(fs.createWriteStream(pdfPath));

    // Titre
    doc.fontSize(22).font('Helvetica-Bold').fillColor('#2c3e50').text('Liste Complète de Tous les Fournisseurs', { align: 'center' });
    doc.moveDown(0.2);
    doc.fontSize(12).font('Helvetica').fillColor('#7f8c8d').text(`Généré le ${new Date().toLocaleDateString('fr-FR')} - Total : ${sorted.length} fournisseurs (actifs/inactifs)`, { align: 'center' });
    doc.moveDown(2);

    for (const f of sorted) {
        const societe = f.societe || 'Societe non renseignee (Profil incomplet)';
        const contact = `${f.user?.first_name || ''} ${f.user?.last_name || ''}`.trim() || 'Inconnu';
        const telephone = f.user?.phone || 'N/A';
        const email = f.user?.email || 'N/A';
        const ville = f.ville?.name || f.autre_ville || 'N/A';
        const status = f.user?.isactif ? 'Compte Actif' : 'Compte Inactif';
        const isComplet = f.is_complet ? 'Oui' : 'Non';

        // Ligne 1 : Société
        doc.fontSize(12).font('Helvetica-Bold').fillColor('#2980b9').text(societe);
        
        // Ligne 2 : Contact
        doc.fontSize(10).font('Helvetica').fillColor('#34495e').text(`Contact: ${contact}  |  Tel: ${telephone}  |  Email: ${email}`);
        
        // Ligne 3 : Infos
        doc.fillColor('#7f8c8d').text(`Ville: ${ville}  |  Statut: ${status}  |  Profil a ete complete : ${isComplet}`);
        
        doc.moveDown(0.5);

        // Saut de page si on arrive en bas, sinon ligne de séparation
        if (doc.y > doc.page.height - 80) {
            doc.addPage();
        } else {
            doc.moveTo(40, doc.y).lineTo(doc.page.width - 40, doc.y).strokeColor('#ecf0f1').stroke();
            doc.moveDown(0.5);
        }
    }

    doc.end();
    console.log(`✅ Fichier PDF V3 généré avec succès : ${pdfPath}`);
}

main()
    .catch(err => {
        console.error('❌ Erreur :', err);
        process.exit(1);
    })
    .finally(() => prisma.$disconnect());
