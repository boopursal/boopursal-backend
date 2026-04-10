"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const prisma_service_1 = require("../prisma/prisma.service");
const bcrypt = require("bcrypt");
let AuthService = class AuthService {
    constructor(prisma, jwtService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
    }
    async login(email, password) {
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
            throw new common_1.UnauthorizedException('Identifiants invalides');
        }
        const hash = user.password.replace(/^\$2y\$/, '$2a$');
        const isMatch = await bcrypt.compare(password, hash);
        if (!isMatch) {
            console.log(`[AUTH] KO: Mot de passe incorrect pour ${cleanEmail}`);
            throw new common_1.UnauthorizedException('Identifiants invalides');
        }
        let roles = [];
        try {
            if (user.roles) {
                const rawRoles = user.roles.trim();
                if (rawRoles.startsWith('a:') || rawRoles.includes(':"')) {
                    const matches = rawRoles.match(/"ROLE_[A-Z_]+"/g);
                    roles = matches ? matches.map(m => m.replace(/"/g, '')) : ['ROLE_USER'];
                }
                else if (rawRoles.startsWith('[') || rawRoles.startsWith('{')) {
                    roles = JSON.parse(rawRoles);
                }
                else {
                    roles = rawRoles.split(/[\s,;]+/).filter(r => r.length > 0);
                }
            }
        }
        catch (e) {
            roles = ['ROLE_USER'];
        }
        if (!roles.length)
            roles = ['ROLE_USER'];
        const type = user.acheteur ? 'acheteur' : user.fournisseur ? 'fournisseur' : 'admin';
        const payload = { sub: user.id, email: user.email, roles: roles, type: type };
        console.log(`[AUTH] OK: Succès pour ${cleanEmail}`);
        return {
            token: await this.jwtService.signAsync(payload),
            user: this.formatUser(user, roles, type)
        };
    }
    formatUser(user, roles, type) {
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
    async validateUser(payload) {
        const userId = payload.sub;
        const usernameEmail = payload.username || payload.email;
        console.log(`[AUTH] Validation session - Sub: ${userId}, Username: ${usernameEmail}`);
        if (!userId && !usernameEmail) {
            console.log(`[AUTH] Validation KO: Payload invalide (pas de sub/username)`);
            return null;
        }
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
                }
                else if (rawRoles.startsWith('[') || rawRoles.startsWith('{')) {
                    roles = JSON.parse(rawRoles);
                }
                else {
                    roles = rawRoles.split(/[\s,;]+/).filter(r => r.length > 0);
                }
            }
        }
        catch (e) {
            roles = ['ROLE_USER'];
        }
        if (!roles.length)
            roles = ['ROLE_USER'];
        const type = user.acheteur ? 'acheteur' : user.fournisseur ? 'fournisseur' : 'admin';
        return this.formatUser(user, roles, type);
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map