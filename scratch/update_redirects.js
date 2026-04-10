const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🔄 Mise à jour massive des URLs de redirection...');

  // Tous ceux qui ont un rôle PRE
  await prisma.user.updateMany({
    where: { roles: { contains: 'ROLE_FOURNISSEUR_PRE' } },
    data: { redirect: '/register/fournisseur' }
  });

  await prisma.user.updateMany({
    where: { roles: { contains: 'ROLE_ACHETEUR_PRE' } },
    data: { redirect: '/register/acheteur' }
  });

  // Tous ceux qui ont le rôle final
  await prisma.user.updateMany({
    where: { 
        roles: { contains: 'ROLE_FOURNISSEUR' },
        NOT: { roles: { contains: '_PRE' } }
    },
    data: { redirect: '/mydashboard' }
  });

  await prisma.user.updateMany({
    where: { 
        roles: { contains: 'ROLE_ACHETEUR' },
        NOT: { roles: { contains: '_PRE' } }
    },
    data: { redirect: '/dashboard_ac' }
  });

  console.log('✅ Synchronisation terminée.');
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
