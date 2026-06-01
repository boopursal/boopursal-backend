const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function test() {
    try {
        console.log('Querying first 5 buyers...');
        const acheteurs = await prisma.acheteur.findMany({
            take: 5
        });
        console.log('Buyers:', acheteurs);

        if (acheteurs.length > 0) {
            const id = acheteurs[0].id;
            console.log(`Querying findUnique for buyer id ${id}...`);
            const item = await prisma.acheteur.findUnique({
                where: { id },
                include: {
                    user: { include: { avatar: true } },
                    ville: true,
                    pays: true,
                    secteur: true,
                    demande_achat: {
                        take: 10,
                        orderBy: { created: 'desc' }
                    }
                },
            });
            console.log('SUCCESS findUnique result:', item ? 'Found' : 'Not found');
        } else {
            console.log('No buyers in database.');
        }
    } catch (err) {
        console.error('ERROR OCCURRED:', err);
    } finally {
        await prisma.$disconnect();
    }
}

test();
