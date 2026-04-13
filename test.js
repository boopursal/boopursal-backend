const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
    try {
        const item = await prisma.fournisseur.findUnique({
            where: { id: 2782 },
            include: {
                user: true,
                pays: true,
                ville: true,
                fournisseur_categories: { include: { categorie: true } },
                abonnement: true,
                produit: true
            }
        });
        console.log("Success", item ? item.id : "null");
    } catch (e) {
        console.error("Error in findUnique:", e.message);
    }
}
main().finally(() => prisma.$disconnect());
