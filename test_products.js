const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const selectCount = await prisma.select_produit.count();
  const productCount = await prisma.produit.count({ where: { del: false, is_valid: true } });
  
  console.log(`Select Produit Count: ${selectCount}`);
  console.log(`Total Valid Products: ${productCount}`);
  
  const sample = await prisma.select_produit.findMany({ 
    take: 3, 
    include: { produit: true } 
  });
  console.log('Sample select_produits:', JSON.stringify(sample, null, 2));
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
