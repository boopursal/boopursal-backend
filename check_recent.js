const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
    const demandes = await prisma.demande_achat.findMany({
        orderBy: { id: 'desc' },
        take: 3,
        include: { 
            demande_ha_categories: true,
            diffusion_demande: true 
        }
    });
    console.log("Recent Demandes:", JSON.stringify(demandes, null, 2));
}

run().catch(console.error).finally(() => prisma.$disconnect());
