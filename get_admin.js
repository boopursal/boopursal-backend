const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const users = await prisma.user.findMany({
    where: { roles: { contains: 'ADMIN' } },
    take: 5
  });
  console.log(users.map(u => ({ email: u.email, roles: u.roles, password: u.password })));
}
main().catch(console.error).finally(() => prisma.$disconnect());
