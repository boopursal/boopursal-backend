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
            '@id': `/api/acheteurs/${item.id}`,
            avatar: item.user?.avatar ? {
                ...item.user.avatar,
                '@id': `/api/avatars/${item.user.avatar.id}`,
                url: item.user.avatar.url
            } : null,
            firstName: item.user?.first_name,
            lastName: item.user?.last_name,
            email: item.user?.email,
            phone: item.user?.phone,
            isactif: item.user?.isactif,
            created: item.user?.created,
            ville: item.ville ? {
                ...item.ville,
                '@id': `/api/villes/${item.ville.id}`
            } : null,
            pays: item.pays ? {
                ...item.pays,
                '@id': `/api/pays/${item.pays.id}`
            } : null,
            secteur: item.secteur ? {
                ...item.secteur,
                '@id': `/api/secteurs/${item.secteur.id}`
            } : null,
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
            '@id': `/api/acheteurs/${item.id}`,
            avatar: item.user?.avatar ? {
                ...item.user.avatar,
                '@id': `/api/avatars/${item.user.avatar.id}`,
                url: item.user.avatar.url
            } : null,
            firstName: item.user?.first_name,
            lastName: item.user?.last_name,
            email: item.user?.email,
            phone: item.user?.phone,
            isactif: item.user?.isactif,
            created: item.user?.created,
            adresse1: item.user?.adresse1 || '',
            adresse2: item.user?.adresse2 || '',
            codepostal: item.user?.codepostal || '',
            ville: item.ville ? {
                ...item.ville,
                '@id': `/api/villes/${item.ville.id}`
            } : null,
            pays: item.pays ? {
                ...item.pays,
                '@id': `/api/pays/${item.pays.id}`
            } : null,
            secteur: item.secteur ? {
                ...item.secteur,
                '@id': `/api/secteurs/${item.secteur.id}`
            } : null,
        };
    }

    async toggleStatut(id: number, statut: boolean) {
        return this.prisma.user.update({
            where: { id },
            data: { isactif: statut },
        });
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

    async update(id: number, data: any) {
        console.log(`[AcheteursService.update] ID: ${id}, keys:`, Object.keys(data || {}));

        const getID = (iri: any) => {
            if (typeof iri === 'string' && iri.startsWith('/api/')) {
                const parts = iri.split('/');
                return parseInt(parts[parts.length - 1]);
            }
            return iri;
        };

        const updateData: any = {};
        if (data.societe !== undefined) updateData.societe = data.societe;
        if (data.civilite !== undefined) updateData.civilite = data.civilite;
        if (data.ice !== undefined) updateData.ice = data.ice;
        if (data.fix !== undefined) updateData.fix = data.fix;
        if (data.website !== undefined) updateData.website = data.website;
        if (data.description !== undefined) updateData.description = data.description;
        if (data.step !== undefined) updateData.step = +data.step;
        if (data.is_complet !== undefined) updateData.is_complet = !!data.is_complet;
        if (data.autreVille !== undefined) updateData.autre_ville = data.autreVille;
        if (data.autreCurrency !== undefined) updateData.autre_currency = data.autreCurrency;
        
        // Merged fields from the first update function
        // adresse1, adresse2, codepostal belong to the user model, so we don't add them to updateData
        
        if (data.pays !== undefined) {
            const paysId = getID(data.pays);
            if (paysId) updateData.pays = { connect: { id: paysId } };
        }
        if (data.ville !== undefined) {
            const villeId = getID(data.ville);
            if (villeId) updateData.ville = { connect: { id: villeId } };
        }
        if (data.currency !== undefined) {
            const curId = getID(data.currency);
            if (curId) updateData.currency = { connect: { id: curId } };
        }
        if (data.secteur !== undefined) {
            const sectId = getID(data.secteur);
            if (sectId) updateData.secteur = { connect: { id: sectId } };
        }

        const updated = await this.prisma.acheteur.update({
            where: { id },
            data: updateData,
            include: { user: true }
        });

        // Sync with User table if user-related fields are provided
        if (data.redirect !== undefined || data.roles !== undefined || data.firstName !== undefined || data.lastName !== undefined || data.email !== undefined || data.phone !== undefined || data.adresse1 !== undefined || data.adresse2 !== undefined || data.codepostal !== undefined) {
            const userUpdate: any = {};
            if (data.redirect !== undefined) userUpdate.redirect = data.redirect;
            if (data.roles !== undefined) {
                userUpdate.roles = Array.isArray(data.roles) ? JSON.stringify(data.roles) : data.roles;
            }
            if (data.firstName !== undefined) userUpdate.first_name = data.firstName;
            if (data.lastName !== undefined) userUpdate.last_name = data.lastName;
            if (data.email !== undefined) userUpdate.email = data.email;
            if (data.phone !== undefined) userUpdate.phone = data.phone;
            if (data.adresse1 !== undefined) userUpdate.adresse1 = data.adresse1;
            if (data.adresse2 !== undefined) userUpdate.adresse2 = data.adresse2;
            if (data.codepostal !== undefined) userUpdate.codepostal = parseInt(data.codepostal);
            
            await this.prisma.user.update({
                where: { id },
                data: userUpdate
            });
        }

        return this.findOne(id);
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
                    isactif: false,
                    created: new Date(),
                    discr: 'acheteur',
                    roles: '["ROLE_ACHETEUR_PRE"]',
                    redirect: '/register/acheteur',
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
            if (data.societe) {
                await this.mailService.sendNewSocieteAlert(data.societe, newUser.email, 'Acheteur').catch(console.error);
            }

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

    async findBlacklistes(id: number) {
        const blacklistes = await this.prisma.black_listes.findMany({
            where: { acheteur_id: id },
            include: { fournisseur: { include: { user: true } } },
            orderBy: { created: 'desc' },
        });

        return {
            'hydra:member': blacklistes.map(bl => ({
                '@id': `/api/black_listes/${bl.id}`,
                '@type': 'BlackListe',
                id: bl.id,
                raison: bl.raison,
                created: bl.created,
                fournisseur: bl.fournisseur ? {
                    '@id': `/api/fournisseurs/${bl.fournisseur.id}`,
                    id: bl.fournisseur.id,
                    societe: bl.fournisseur.societe,
                    email: bl.fournisseur.user?.email,
                } : null,
            })),
            'hydra:totalItems': blacklistes.length,
        };
    }

    async findDemandes(id: number, page = 1, limit = 10) {
        const skip = (page - 1) * limit;

        const [data, total] = await Promise.all([
            this.prisma.demande_achat.findMany({
                where: { acheteur_id: id },
                skip,
                take: limit,
                orderBy: { created: 'desc' },
                include: {
                    currency: true,
                    demande_ha_categories: {
                        include: { categorie: true }
                    }
                }
            }),
            this.prisma.demande_achat.count({
                where: { acheteur_id: id },
            }),
        ]);

        return {
            'hydra:member': data.map(d => ({
                '@id': `/api/demande_achats/${d.id}`,
                '@type': 'DemandeAchat',
                id: d.id,
                reference: d.reference,
                titre: d.titre,
                statut: d.statut,
                created: d.created,
                dateExpiration: d.date_expiration,
                budget: d.budget,
                currency: d.currency ? { name: d.currency.name } : null,
                localisation: d.localisation,
                is_public: d.is_public,
                categories: d.demande_ha_categories ? d.demande_ha_categories.map(ha => ({ name: ha.categorie?.name })) : [],
            })),
            'hydra:totalItems': total,
        };
    }
}
