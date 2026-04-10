import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MailService } from '../mail/mail.service';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

@Injectable()
export class AcheteursService {
    constructor(private readonly prisma: PrismaService, private readonly mailService: MailService) { }

    async findAll(page = 1, limit = 20, search?: string) {
        const skip = (page - 1) * limit;

        const where = search
            ? {
                user: {
                    OR: [
                        { first_name: { contains: search } },
                        { last_name: { contains: search } },
                        { email: { contains: search } },
                    ],
                },
            }
            : {};

        const [data, total] = await Promise.all([
            this.prisma.acheteur.findMany({
                where,
                skip,
                take: limit,
                include: {
                    user: { include: { avatar: true } },
                    ville: true,
                    pays: true,
                    secteur: true,
                },
                orderBy: { id: 'desc' },
            }),
            this.prisma.acheteur.count({ where }),
        ]);

        const flattenedData = data.map(item => ({
            ...item,
            avatar: item.user?.avatar ? {
                ...item.user.avatar,
                url: item.user.avatar.url
            } : null,
            firstName: item.user?.first_name,
            lastName: item.user?.last_name,
            email: item.user?.email,
            phone: item.user?.phone,
            isactif: item.user?.isactif,
            created: item.user?.created,
        }));

        return {
            'hydra:member': flattenedData,
            'hydra:totalItems': total,
        };
    }

    async findOne(id: number) {
        const item = await this.prisma.acheteur.findUnique({
            where: { id },
            include: {
                user: { include: { avatar: true } },
                ville: true,
                pays: true,
                secteur: true,
                demande_achat: {
                    take: 10,
                    orderBy: { created: 'desc' }
                }
            },
        });

        if (!item) return null;

        return {
            ...item,
            avatar: item.user?.avatar ? {
                ...item.user.avatar,
                url: item.user.avatar.url
            } : null,
            firstName: item.user?.first_name,
            lastName: item.user?.last_name,
            email: item.user?.email,
            phone: item.user?.phone,
            isactif: item.user?.isactif,
            created: item.user?.created,
        };
    }

    async toggleStatut(id: number, statut: boolean) {
        return this.prisma.user.update({
            where: { id },
            data: { isactif: statut },
        });
    }

    async update(id: number, data: any) {
        const getID = (iri: any) => {
            if (typeof iri === 'string' && iri.startsWith('/api/')) {
                const parts = iri.split('/');
                return parseInt(parts[parts.length - 1]);
            }
            if (iri && typeof iri === 'object' && iri.id) return iri.id;
            if (iri && typeof iri === 'object' && iri.value) return getID(iri.value);
            return iri;
        };

        const updateData: any = {};
        if (data.societe !== undefined) updateData.societe = data.societe;
        if (data.ice !== undefined) updateData.ice = data.ice;
        if (data.fix !== undefined) updateData.fix = data.fix;
        if (data.website !== undefined) updateData.website = data.website;
        if (data.adresse1 !== undefined) updateData.adresse1 = data.adresse1;
        if (data.adresse2 !== undefined) updateData.adresse2 = data.adresse2;
        if (data.codepostal !== undefined) updateData.codepostal = parseInt(data.codepostal);
        if (data.description !== undefined) updateData.description = data.description;

        if (data.pays) updateData.pays_id = getID(data.pays);
        if (data.ville) updateData.ville_id = getID(data.ville);
        if (data.secteur) updateData.secteur_id = getID(data.secteur);

        const acheteur = await this.prisma.acheteur.update({
            where: { id },
            data: updateData,
            include: { user: true }
        });

        // Update user info if provided
        if (data.firstName || data.lastName || data.email || data.phone || data.civilite) {
            const userUpdate: any = {};
            if (data.firstName) userUpdate.first_name = data.firstName;
            if (data.lastName) userUpdate.last_name = data.lastName;
            if (data.email) userUpdate.email = data.email;
            if (data.phone) userUpdate.phone = data.phone;
            if (data.civilite) userUpdate.civilite = data.civilite;

            await this.prisma.user.update({
                where: { id },
                data: userUpdate
            });
        }

        return this.findOne(id);
    }

    async getStats() {
        const [total, actifs, inactifs] = await Promise.all([
            this.prisma.acheteur.count(),
            this.prisma.user.count({
                where: { acheteur: { isNot: null }, isactif: true },
            }),
            this.prisma.user.count({
                where: { acheteur: { isNot: null }, isactif: false },
            }),
        ]);

        return {
            total,
            actifs,
            inactifs,
            recents: 0,
        };
    }

    async create(data: any) {
        console.log('[AcheteursService.create] Incoming data keys:', Object.keys(data || {}));
        console.log('[AcheteursService.create] Body email:', data?.email, '| has password:', !!data?.password);

        // Validation basique — erreur métier (400)
        if (!data.email || !data.password) {
            console.error('[AcheteursService.create] Missing email or password. Body received:', JSON.stringify(data));
            const err: any = new Error('Email et mot de passe requis');
            err.isValidation = true;
            throw err;
        }

        try {
            const existing = await this.prisma.user.findFirst({
                where: { email: data.email.trim() }
            });

            if (existing) {
                const err: any = new Error('Cet email existe déjà.');
                err.isValidation = true;
                throw err;
            }

            const hashedPassword = await bcrypt.hash(data.password, 10);
            const confirmationToken = crypto.randomBytes(20).toString('hex');

            const newUser = await this.prisma.user.create({
                data: {
                    first_name: data.firstName || '',
                    last_name: data.lastName || '',
                    email: data.email.trim().toLowerCase(),
                    phone: data.phone || '',
                    password: hashedPassword,
                    confirmation_token: confirmationToken,
                    del: false,
                    isactif: true,
                    created: new Date(),
                    discr: 'acheteur',
                    roles: '["ROLE_ACHETEUR_PRE"]',
                    redirect: '/boopursal/acheteur/dashboard',
                    acheteur: {
                        create: {
                            societe: data.societe || '',
                            civilite: data.civilite || 'M.',
                            role: 'ROLE_ACHETEUR',
                            is_complet: false,
                            step: 1,
                        }
                    }
                },
                include: { acheteur: true }
            });

            console.log('[AcheteursService.create] ✅ Acheteur créé:', newUser.id);
            
            // Dispatch emails (await for serverless reliability)
            await this.mailService.sendConfirmationEmail(newUser.email, confirmationToken).catch(console.error);
            await this.mailService.newRegister(newUser.email, 'Acheteur').catch(console.error);

            const returnAcheteur: any = newUser.acheteur;

            return {
                ...returnAcheteur,
                email: newUser.email,
                firstName: newUser.first_name,
                lastName: newUser.last_name,
                '@id': returnAcheteur ? `/api/acheteurs/${returnAcheteur.id}` : null
            };
        } catch (err: any) {
            // Re-throw validation errors as-is (handled as 400 in controller)
            if (err.isValidation) throw err;
            // Wrap DB/unexpected errors
            console.error('[AcheteursService.create] DB Error:', err?.message || err);
            console.error('[AcheteursService.create] Stack:', err?.stack);
            const dbErr: any = new Error(`Erreur DB: ${err?.message || 'Création compte impossible'}`);
            dbErr.isDb = true;
            throw dbErr;
        }
    }
}
