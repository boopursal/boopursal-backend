import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
    ) { }

    async login(email: string, password: string) {
        const cleanEmail = (email || '').trim().toLowerCase();
        
        console.log(`[AUTH] Tentative de connexion pour : ${cleanEmail}`);

        const user = await this.prisma.user.findFirst({
            where: { email: cleanEmail },
            include: {
                acheteur: true,
                fournisseur: true,
                avatar: true,
            },
        });

        if (!user) {
            console.log(`[AUTH] KO: Email non trouvé (${cleanEmail})`);
            throw new UnauthorizedException('Identifiants invalides');
        }

        // Symfony utilise parfois $2y$, bcryptJS/Node préfère $2a$
        const hash = user.password.replace(/^\$2y\$/, '$2a$');
        const isMatch = await bcrypt.compare(password, hash);

        if (!isMatch) {
            console.log(`[AUTH] KO: Mot de passe incorrect pour ${cleanEmail}`);
            throw new UnauthorizedException('Identifiants invalides');
        }

        // Parsing des rôles (compatibilité Symfony serialized array)
        let roles = [];
        try {
            if (user.roles) {
                const rawRoles = user.roles.trim();
                if (rawRoles.startsWith('a:') || rawRoles.includes(':"')) {
                    const matches = rawRoles.match(/"ROLE_[A-Z_]+"/g);
                    roles = matches ? matches.map(m => m.replace(/"/g, '')) : ['ROLE_USER'];
                } else if (rawRoles.startsWith('[') || rawRoles.startsWith('{')) {
                    roles = JSON.parse(rawRoles);
                } else {
                    roles = rawRoles.split(/[\s,;]+/).filter(r => r.length > 0);
                }
            }
        } catch (e) {
            roles = ['ROLE_USER'];
        }
        if (!roles.length) roles = ['ROLE_USER'];

        const type = user.acheteur ? 'acheteur' : user.fournisseur ? 'fournisseur' : 'admin';
        const payload = { sub: user.id, email: user.email, roles: roles, type: type };

        console.log(`[AUTH] OK: Succès pour ${cleanEmail}`);

        return {
            token: await this.jwtService.signAsync(payload),
            user: this.formatUser(user, roles, type)
        };
    }

    private formatUser(user: any, roles: string[], type: string) {
        const mainRole = roles[0] || 'ROLE_USER';
        return {
            role: mainRole, 
            from: 'jwt',
            data: {
                id: user.id,
                displayName: `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.email,
                email: user.email,
                firstName: user.first_name,
                lastName: user.last_name,
                type: type,
                role: mainRole,
                roles: roles,
                photoURL: user.avatar ? user.avatar.url : null,
                settings: {},
                shortcuts: []
            }
        };
    }

    async validateUser(payload: any) {
        // Compatibilité avec les tokens LexikJWT (Symfony) qui utilisaient username au lieu de sub
        const userId = payload.sub;
        const usernameEmail = payload.username || payload.email;

        console.log(`[AUTH] Validation session - Sub: ${userId}, Username: ${usernameEmail}`);

        if (!userId && !usernameEmail) {
            console.log(`[AUTH] Validation KO: Payload invalide (pas de sub/username)`);
            return null; // Retourne proprement 401 au lieu de 500
        }

        // Recherche par ID préférentiellement, ou par email pour les anciens tokens
        const user = await this.prisma.user.findFirst({
            where: userId ? { id: userId } : { email: usernameEmail },
            include: {
                acheteur: true,
                fournisseur: true,
                avatar: true,
            },
        });

        if (!user) {
            console.log(`[AUTH] Validation KO: Utilisateur introuvable`);
            return null;
        }

        let roles = [];
        try {
            if (user.roles) {
                const rawRoles = user.roles.trim();
                if (rawRoles.startsWith('a:') || rawRoles.includes(':"')) {
                    const matches = rawRoles.match(/"ROLE_[A-Z_]+"/g);
                    roles = matches ? matches.map(m => m.replace(/"/g, '')) : ['ROLE_USER'];
                } else if (rawRoles.startsWith('[') || rawRoles.startsWith('{')) {
                    roles = JSON.parse(rawRoles);
                } else {
                    roles = rawRoles.split(/[\s,;]+/).filter(r => r.length > 0);
                }
            }
        } catch (e) {
            roles = ['ROLE_USER'];
        }
        if (!roles.length) roles = ['ROLE_USER'];

        const type = user.acheteur ? 'acheteur' : user.fournisseur ? 'fournisseur' : 'admin';
        return this.formatUser(user, roles, type);
    }
}
