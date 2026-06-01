const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const latestDemandes = await prisma.demande_achat.findMany({
      take: 3,
      orderBy: { created: 'desc' },

    });
    console.log(JSON.stringify(latestDemandes, null, 2));
  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
