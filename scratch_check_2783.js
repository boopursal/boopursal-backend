const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const totalAcheteurs = await prisma.acheteur.count();
    console.log("Total Acheteurs in DB:", totalAcheteurs);
    const latestAcheteurs = await prisma.acheteur.findMany({
      take: 5,
      include: { user: true }
    });
    console.log("Latest Acheteurs:", JSON.stringify(latestAcheteurs, null, 2));
  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
