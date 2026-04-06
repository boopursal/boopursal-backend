
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const keys = Object.keys(prisma).filter(k => !k.startsWith('$'));
  console.log('Available Models:', keys.sort().join(', '));
  
  if (keys.includes('media')) {
      const data = await prisma.media.findMany({ take: 3 });
      console.log('Media URLs sample:', data.map(m => m.url));
  } else {
      console.log('ERROR: media model not found in Prisma keys.');
  }

  const pKeys = Object.keys(prisma.produit);
  console.log('Produit properties:', pKeys);

  const p = await prisma.produit.findFirst({
      where: { featured_image_id: { not: null } },
      include: { image_produit: true }
  });
  console.log('Produit sample Image URL:', p ? p.image_produit?.url : 'No product found');
}

main().catch(console.error).finally(() => prisma.$disconnect());
