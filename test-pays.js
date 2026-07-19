const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const prods = await prisma.produit.findMany({ where: { pays: { slug: 'chine' } }, include: { pays: true } });
    console.log('Chine produits:', prods.length);

    const maroc = await prisma.produit.findMany({ where: { pays: { slug: 'maroc' } }, include: { pays: true } });
    console.log('Maroc produits:', maroc.length);

    const allPays = await prisma.pays.findMany();
    console.log('Pays:', allPays);
}

main().finally(() => prisma.$disconnect());
