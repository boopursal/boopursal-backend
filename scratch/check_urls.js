const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const images = await prisma.image_produit.findMany({ take: 5 });
  console.log('Sample ImageProduit URLs:', JSON.stringify(images, null, 2));
  
  const avatars = await prisma.avatar.findMany({ take: 5 });
  console.log('Sample Avatar URLs:', JSON.stringify(avatars, null, 2));
}

main().catch(err => {
  console.error(err);
  process.exit(1);
}).finally(async () => {
  await prisma.$disconnect();
});
