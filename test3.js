const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
    try {
        console.log("Checking secteurs...");
        const secteurs = await prisma.secteur.findMany({
            where: { del: false },
            include: { image_secteur: true, categorie: { include: { categorie_sous_secteur: true } } },
            orderBy: { name: 'asc' },
            take: 2
        });
        console.log("Success Secteurs:", secteurs.length);
    } catch(e) {
        console.error("Secteur Error:", e);
    }
}
main().finally(() => prisma.$disconnect());
