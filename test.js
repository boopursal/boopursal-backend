const { PrismaClient } = require('@prisma/client'); const prisma = new PrismaClient(); prisma.demande_abonnement.findUnique({where: {id: 6}}).then(console.log).finally(() => prisma.$disconnect());
