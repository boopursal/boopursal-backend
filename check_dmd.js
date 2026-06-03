const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const dmd = await prisma.demande_abonnement.findFirst({
    orderBy: { created: 'desc' },
    include: { fournisseur: { include: { user: true } }, offre: true, duree: true }
  });
  console.log(JSON.stringify(dmd, null, 2));
  await prisma.$disconnect();
}
main();
