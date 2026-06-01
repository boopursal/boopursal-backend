const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const res = await prisma.abonnement.update({ 
      where: { id: 3 }, 
      data: { fournisseur_id: 799, offre_id: 2, mode_id: 1, is_read: 1, date_validation: null, created: new Date('2024-05-16T15:15:40+00:00') } 
    });
    console.log("Success:", res);
  } catch (e) {
    console.error("Prisma Error:", e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
