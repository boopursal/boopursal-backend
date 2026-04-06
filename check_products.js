
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const products = await prisma.produit.findMany({
        where: { featured_image_id_id: { not: null } },
        take: 5,
        include: { image_produit: true }
    });
    console.log(JSON.stringify(products, null, 2));
}

main().catch(e => {
    console.error(e);
    process.exit(1);
}).finally(async () => {
    await prisma.$disconnect();
});
