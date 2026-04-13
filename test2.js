const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
    try {
        console.log("Checking User 2782...");
        const user = await prisma.user.findUnique({ where: { id: 2782 }, include: { fournisseur: true } });
        console.log("User:", JSON.stringify(user, null, 2));

        console.log("\nChecking Fournisseur 2782...");
        const fournisseur = await prisma.fournisseur.findUnique({ where: { id: 2782 } });
        console.log("Fournisseur:", JSON.stringify(fournisseur, null, 2));
    } catch(e) {
        console.error(e);
    }
}
main().finally(() => prisma.$disconnect());
