const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');

async function main() {
    console.log('📄 Génération du PDF en cours...');
    const dataPath = path.join(__dirname, 'exports', 'fournisseurs_par_secteur.json');
    
    if (!fs.existsSync(dataPath)) {
        console.error("❌ Le fichier JSON n'existe pas. Veuillez relancer l'export.");
        process.exit(1);
    }

    const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    const pdfPath = path.join(__dirname, 'exports', 'fournisseurs_par_secteur_v2.pdf');
    
    // Initialisation du document PDF (A4)
    const doc = new PDFDocument({ margin: 50, size: 'A4' });
    doc.pipe(fs.createWriteStream(pdfPath));

    // Titre Principal
    doc.fontSize(22).font('Helvetica-Bold').fillColor('#2c3e50').text('Annuaire des Fournisseurs', { align: 'center' });
    doc.moveDown(0.2);
    doc.fontSize(12).font('Helvetica').fillColor('#7f8c8d').text(`Généré le ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR')}`, { align: 'center' });
    doc.moveDown(2);

    // Parcourir les données
    for (const secteur of data) {
        // Compter les fournisseurs réels dans ce secteur
        let nbFournisseursSecteur = 0;
        for (const ss of secteur.sous_secteurs) {
            for (const cat of ss.categories) {
                nbFournisseursSecteur += cat.nb_fournisseurs;
            }
        }

        // On n'affiche pas le secteur s'il n'y a aucun fournisseur
        if (nbFournisseursSecteur === 0) continue; 

        // Afficher le Secteur
        doc.fontSize(16).font('Helvetica-Bold').fillColor('#e74c3c').text(`Secteur : ${secteur.secteur_name}`);
        doc.moveDown(0.5);

        for (const ss of secteur.sous_secteurs) {
            let nbFournisseursSS = 0;
            for (const cat of ss.categories) {
                nbFournisseursSS += cat.nb_fournisseurs;
            }
            if (nbFournisseursSS === 0) continue;

            // Afficher le Sous-Secteur
            doc.fontSize(14).font('Helvetica-Bold').fillColor('#2980b9').text(`>> ${ss.sous_secteur_name}`, { indent: 20 });
            doc.moveDown(0.3);

            for (const cat of ss.categories) {
                if (cat.nb_fournisseurs === 0) continue;

                // Afficher la Catégorie
                doc.fontSize(12).font('Helvetica-Bold').fillColor('#27ae60').text(`Categorie : ${cat.categorie_name}`, { indent: 40 });
                doc.moveDown(0.2);

                // Afficher les fournisseurs
                for (const f of cat.fournisseurs) {
                    const societe = f.societe || 'Societe non renseignee';
                    const contact = `${f.prenom} ${f.nom}`.trim() || 'Contact inconnu';
                    const telephone = f.telephone || 'N/A';
                    const email = f.email || 'N/A';
                    const ville = f.ville || 'N/A';

                    // Ligne du fournisseur
                    doc.fontSize(10).font('Helvetica-Bold').fillColor('#2c3e50').text(`- ${societe}`, { indent: 60, continued: true });
                    doc.font('Helvetica').fillColor('#7f8c8d').text(`  |  Ville: ${ville}  |  Contact: ${contact}  |  Tel: ${telephone}  |  Email: ${email}`);
                }
                doc.moveDown(0.5);
            }
        }
        
        // Séparateur entre secteurs (si on est pas trop près du bas)
        if (doc.y > doc.page.height - 150) {
            doc.addPage();
        } else {
            doc.moveDown(1);
            doc.moveTo(50, doc.y).lineTo(doc.page.width - 50, doc.y).strokeColor('#bdc3c7').stroke();
            doc.moveDown(1);
        }
    }

    doc.end();
    console.log(`✅ Fichier PDF généré avec succès : ${pdfPath}`);
}

main().catch(err => {
    console.error('❌ Erreur lors de la génération du PDF :', err);
    process.exit(1);
});
