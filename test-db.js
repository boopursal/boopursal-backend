const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function test() {
  try {
    const pays = await prisma.pays.findMany({ take: 5 });
    console.log('PAYS FOUND:', pays.length);
    console.log('SAMPLE:', pays[0]);
    
    const currencies = await prisma.currency.findMany({ take: 5 });
    console.log('CURRENCIES FOUND:', currencies.length);
  } catch (err) {
    console.error('ERROR:', err);
  } finally {
    await prisma.$disconnect();
  }
}

test();
