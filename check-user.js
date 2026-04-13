const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const email = 'votre-email@test.com'; // À adapter ou chercher le dernier créé
  const user = await prisma.user.findFirst({
    where: { discr: 'fournisseur' },
    orderBy: { created: 'desc' },
    include: { fournisseur: true }
  });

  if (user) {
    console.log('--- USER DEBUG ---');
    console.log('ID:', user.id);
    console.log('Roles:', user.roles);
    console.log('isactif:', user.isactif);
    if (user.fournisseur) {
      console.log('Societe:', user.fournisseur.societe);
      console.log('is_complet:', user.fournisseur.is_complet);
      console.log('Step:', user.fournisseur.step);
    } else {
      console.log('NO FOURNISSEUR LINKED');
    }
  } else {
    console.log('No user found');
  }
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
