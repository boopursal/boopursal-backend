"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt = require("bcrypt");
const prisma = new client_1.PrismaClient();
async function checkPassword() {
    const user = await prisma.user.findFirst({
        where: { email: { not: '' } }
    });
    if (!user) {
        console.log('Aucun utilisateur trouvé.');
        return;
    }
    console.log('Email:', user.email);
    console.log('Hash original:', user.password);
    const hash2a = user.password.replace(/^\$2y\$/, '$2a$');
    console.log('Hash converti:', hash2a);
    try {
        const isValid = await bcrypt.compare('password_test', hash2a);
        console.log('Structure du hash valide pour bcrypt:', true);
    }
    catch (e) {
        console.log('Structure du hash NON VALIDE:', e.message);
    }
}
checkPassword();
//# sourceMappingURL=check-pass.js.map