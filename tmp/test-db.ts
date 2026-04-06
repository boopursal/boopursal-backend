
import { PrismaClient } from '@prisma/client';

async function main() {
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: "mysql://root:@127.0.0.1:3306/boopugbb_ha"
      }
    }
  });

  try {
    console.log('Testing connection to boopugbb_ha...');
    await prisma.$connect();
    console.log('✅ Connection successful!');
    
    const count = await prisma.user.count();
    console.log(`Users count: ${count}`);
    
    await prisma.$disconnect();
  } catch (e) {
    console.error('❌ Connection failed:');
    console.error(e);
    process.exit(1);
  }
}

main();
