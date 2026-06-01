const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
    const demande = await prisma.demande_achat.findUnique({
        where: { id: 372 },
        include: { 
            demande_ha_categories: true,
            diffusion_demande: true 
        }
    });
    console.log("Demande:", JSON.stringify(demande, null, 2));

    if (demande) {
        const catIds = demande.demande_ha_categories.map(c => c.categorie_id);
        console.log("Cat IDs:", catIds);
        
        const fournisseurs = await prisma.fournisseur.findMany({
            where: {
                is_complet: true,
                fournisseur_categories: {
                    some: { categorie_id: { in: catIds } }
                }
            },
            include: { user: true }
        });
        console.log("Fournisseurs that would be alerted:", fournisseurs.length);
        fournisseurs.forEach(f => console.log(f.societe, f.user?.email));
    }
}

run().catch(console.error).finally(() => prisma.$disconnect());
