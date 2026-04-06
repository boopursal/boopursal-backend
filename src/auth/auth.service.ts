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
        const fs = require('fs');
        const logToDisk = (msg: string) => fs.appendFileSync('debug-auth.txt', `\n[${new Date().toISOString()}] ${msg}`);

        logToDisk(`Tentative: ${cleanEmail}`);

        const user = await this.prisma.user.findFirst({
            where: { email: cleanEmail },
            include: {
                acheteur: true,
                fournisseur: true,
                avatar: true,
            },
        });

        if (!user) {
            logToDisk(` -> KO: Email non trouve (${cleanEmail})`);
            throw new UnauthorizedException('Identifiants invalides');
        }

        const hash = user.password.replace(/^\$2y\$/, '$2a$');
        const isMatch = await bcrypt.compare(password, hash);

        if (!isMatch) {
            logToDisk(` -> KO: Pass incorrect pour ${cleanEmail}`);
            throw new UnauthorizedException('Identifiants invalides');
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
        const payload = { sub: user.id, email: user.email, roles: roles, type: type };

        logToDisk(` -> OK: Succes pour ${cleanEmail}`);

        return {
            token: await this.jwtService.signAsync(payload),
            user: this.formatUser(user, roles, type)
        };
    }

    private formatUser(user: any, roles: string[], type: string) {
        const mainRole = roles[0] || 'ROLE_USER';
        return {
            role: mainRole, // Renvoi en String pour la compatibilité avec filterNavigationByUser
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
                photoURL: user.avatar ? `/images/avatar/${user.avatar.url}` : null,
                settings: {},
                shortcuts: []
            }
        };
    }

    async validateUser(payload: any) {
        const fs = require('fs');
        const logToDisk = (msg: string) => fs.appendFileSync('debug-auth.txt', `\n[${new Date().toISOString()}] ${msg}`);

        logToDisk(`AutoLogin pour ID: ${payload.sub} (${payload.email})`);

        const user = await this.prisma.user.findUnique({
            where: { id: payload.sub },
            include: {
                acheteur: true,
                fournisseur: true,
                avatar: true,
            },
        });

        if (!user) {
            logToDisk(` -> AutoLogin KO: User ${payload.sub} introuvable`);
            return null;
        }

        // On refait le parsing des rôles pour le retour de session
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
