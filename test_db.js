const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
    const data = await prisma.demande_abonnement.findMany({
        orderBy: { created: 'desc' },
        take: 5,
        include: { fournisseur: true }
    });
    console.log(JSON.stringify(data, null, 2));
}
main().catch(console.error).finally(() => prisma.$disconnect());
