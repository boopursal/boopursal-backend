import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

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

    // Test avec un mot de passe commun ou simple si vous voulez me le donner
    // Sinon, on va juste vérifier si le hash est structurellement valide pour bcrypt
    try {
        const isValid = await bcrypt.compare('password_test', hash2a);
        console.log('Structure du hash valide pour bcrypt:', true);
    } catch (e) {
        console.log('Structure du hash NON VALIDE:', e.message);
    }
}

checkPassword();
