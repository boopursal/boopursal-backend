const { PrismaClient } = require('@prisma/client');
const client = new PrismaClient();
console.log('--- TEST PRISMA ---');
client.$connect()
    .then(() => {
        console.log('✅ Connexion MySQL réussie !');
        process.exit(0);
    })
    .catch((err) => {
        console.error('❌ Erreur :', err);
        process.exit(1);
    });
