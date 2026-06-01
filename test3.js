const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
    try {
        console.log("Checking fournisseurs/2782/produits...");
        const produits = await prisma.produit.findMany({
            where: { fournisseur_id: 2782, del: false },
            skip: 0,
            take: 20,
            include: {
                categorie: true,
                secteur: true,
                sous_secteur: true,
                currency: true,
                image_produit: true
            },
            orderBy: { created: 'desc' },
        });
        console.log("Success Produit!");
    } catch(e) {
        console.error("Produits Error:", e);
    }
}
main().finally(() => prisma.$disconnect());
