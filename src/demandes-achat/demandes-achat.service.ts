import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ValidationRfqService } from './validation-rfq.service';
import { MailService } from '../mail/mail.service';
@Injectable()
export class DemandesAchatService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly validationService: ValidationRfqService,
        private readonly mailService: MailService
    ) { }

    async findAll(query: any = {}) {
        try {
            const page = Math.max(1, parseInt(query.page || '1') || 1);
            const limit = Math.max(1, Math.min(100, parseInt(query.itemsPerPage || '20') || 20));
            const skip = (page - 1) * limit;

            const where: any = { del: false };

            // Filtrage Statut
            if (query.statut !== undefined) {
                const statut = parseInt(query.statut);
                if (!isNaN(statut)) {
                    where.statut = statut;
                }
            }

            // Recherche textuelle 'q' ou 'search'
            const search = query.q || query.search;
            if (search && typeof search === 'string') {
                where.OR = [
                    { titre: { contains: search } },
                    { reference: { contains: search } },
                    { description: { contains: search } }
                ];
            }

            // Filtres relationnels (Protection contre les accès invalides)
            if (query['acheteur.pays.slug']) {
                where.acheteur = { pays: { slug: String(query['acheteur.pays.slug']) } };
            }
            
            if (query['acheteur.ville.slug']) {
                where.acheteur = { ...(where.acheteur || {}), ville: { slug: String(query['acheteur.ville.slug']) } };
            }

            if (query['categories.slug']) {
                where.demande_ha_categories = {
                    some: { categorie: { slug: String(query['categories.slug']) } }
                };
            }

            if (query.isPublic !== undefined) {
                where.is_public = String(query.isPublic) === '1' || String(query.isPublic) === 'true';
            }

            // Tri sécurisé
            const orderBy: any = {};
            const orderBracketKey = Object.keys(query).find(k => k.startsWith('order[') && k.endsWith(']'));
            
            let field = 'id';
            let direction: 'asc' | 'desc' = 'desc';

            if (orderBracketKey) {
                field = orderBracketKey.replace('order[', '').replace(']', '');
                const rawDir = String(query[orderBracketKey]).toLowerCase();
                direction = rawDir === 'asc' ? 'asc' : 'desc';
            } else if (query.order && typeof query.order === 'object') {
                const keys = Object.keys(query.order);
                if (keys.length > 0) {
                    field = keys[0];
                    const rawDir = String(query.order[field]).toLowerCase();
                    direction = rawDir === 'asc' ? 'asc' : 'desc';
                }
            }

            // Mapping des champs de tri
            const fieldMap: Record<string, string> = {
                'created': 'created',
                'createdAt': 'created',
                'dateExpiration': 'date_expiration',
                'id': 'id'
            };
            
            const dbField = fieldMap[field] || field;
            orderBy[dbField] = direction;

            const [data, total] = await Promise.all([
                this.prisma.demande_achat.findMany({
                    where,
                    skip,
                    take: limit,
                    select: {
                        id: true,
                        reference: true,
                        titre: true,
                        description: true,
                        pays: true,
                        ville: true,
                        date_expiration: true,
                        created: true,
                        slug: true,
                        statut: true,
                        is_public: true,
                        budget: true,
                        del: true,
                        acheteur: {
                            select: { id: true, societe: true }
                        },
                        currency: {
                            select: { currency: true }
                        },
                        diffusion_demande: {
                            select: { id: true }
                        },
                        demande_ha_categories: {
                            include: { categorie: true }
                        }
                    },
                    orderBy,
                }),
                this.prisma.demande_achat.count({ where }),
            ]);

            const flattenedData = data.map(item => ({
                ...item,
                '@id': `/api/demande_achats/${item.id}`,
                pays: item.pays || null,
                ville: item.ville || null,
                dateExpiration: item.date_expiration,
                diffusionsdemandes: item.diffusion_demande || [],
                categories: item.demande_ha_categories ? item.demande_ha_categories.map((c: any) => ({
                    ...c.categorie,
                    '@id': `/api/categories/${c.categorie.id}`
                })) : [],
                acheteur: item.acheteur ? {
                    ...item.acheteur,
                    '@id': `/api/acheteurs/${item.acheteur.id}`,
                } : null,
                currency: item.currency ? item.currency.currency : 'MAD'
            }));

            return {
                'hydra:member': flattenedData,
                'hydra:totalItems': total,
            };
        } catch (error) {
            console.error('[DemandesAchatService] Error in findAll:', error?.message || error);
            // Retourner un résultat vide plutôt qu'une 500
            return {
                'hydra:member': [],
                'hydra:totalItems': 0,
            };
        }
    }


    private extractId(idOrSlug: string): number {
        const id = parseInt(idOrSlug.split('-')[0]);
        return isNaN(id) ? 0 : id;
    }

    async findOne(idOrSlug: string) {
        const id = this.extractId(idOrSlug);
        const p = await this.prisma.demande_achat.findUnique({
            where: { id },
            include: {
                acheteur: {
                    include: {
                        user: true,
                        ville: true,
                        pays: true,
                        secteur: true
                    }
                },
                currency: true,
                demande_ha_categories: {
                    include: {
                        categorie: true
                    }
                },
                diffusion_demande: true,
                demande_achat_attachement: {
                    include: {
                        attachement: true
                    }
                }
            },
        });

        if (!p) return null;

        // Re-mappage pour correspondre aux attentes du frontend Fuse/Hydra
        return {
            ...p,
            '@id': `/api/demande_achats/${p.id}`,
            categories: p.demande_ha_categories.map(c => ({
                ...c.categorie,
                '@id': `/api/categories/${c.categorie.id}`
            })),
            diffusionsdemandes: p.diffusion_demande || [],
            attachements: p.demande_achat_attachement.map(a => ({
                ...a.attachement,
                '@id': `/api/attachements/${a.attachement.id}`,
                url: `attachement/demandeAchat/${a.attachement.url}`,
            })),
            dateExpiration: p.date_expiration,
            validationReport: this.validationService.validate({ 
                titre: p.titre, 
                description: p.description 
            })
        };
    }

    async findFournisseur(idOrSlug: string) {
        const id = this.extractId(idOrSlug);
        const demande = await this.prisma.demande_achat.findUnique({
            where: { id },
            include: {
                fournisseur: {
                    include: {
                        user: true
                    }
                }
            }
        });

        if (!demande || !demande.fournisseur) return null;

        return {
            ...demande.fournisseur,
            '@id': `/api/fournisseurs/${demande.fournisseur.id}`
        };
    }

    async getStats() {
        const [total, valides, rejetees] = await Promise.all([
            this.prisma.demande_achat.count({ where: { del: false } }),
            this.prisma.demande_achat.count({ where: { del: false, statut: 1 } }),
            this.prisma.demande_achat.count({ where: { del: false, statut: 2 } }),
        ]);

        return { total, valides, rejetees };
    }

    async findVisites(idOrSlug: string) {
        const id = this.extractId(idOrSlug);
        const data = await this.prisma.detail_visite.findMany({
            where: { demande_id: id },
            include: {
                fournisseur: true,
                personnel: true,
            },
        });
        return {
            'hydra:member': data,
            'hydra:totalItems': data.length
        };
    }

    async create(data: any, user: any) {
        console.log(`[DemandesAchatService] create`, Object.keys(data || {}));
        
        // user may be the JWT payload object returned by formatUser
        const acheteurId = user?.data?.acheteur?.id || user?.data?.id || user?.id;
        
        if (!acheteurId) {
            console.error('[DemandesAchatService] create - Acheteur ID missing in user:', user);
            throw new Error('Acheteur ID is required');
        }

        // 1. Create the demande
        const created = await this.prisma.demande_achat.create({
            data: {
                titre: data.titre,
                description: data.description,
                reference: data.reference || `RFQ-${Date.now()}`,
                statut: 0, // En attente
                is_public: Boolean(data.isPublic),
                is_anonyme: Boolean(data.isAnonyme),
                is_alerted: false,
                is_sent: false,
                del: false,
                budget: parseFloat(data.budget) || 0,
                localisation: data.localisation ? String(data.localisation) : null,
                date_expiration: data.dateExpiration ? new Date(data.dateExpiration) : null,
                autre_categories: data.autreCategories,
                created: new Date(),
                date_modification: new Date(),
                slug: `rfq-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
                acheteur: {
                    connect: { id: acheteurId }
                }
            }
        });

        // Mettre à jour la référence avec l'ID pour avoir un format sympa si non fournie
        if (!data.reference || data.reference === '') {
            await this.prisma.demande_achat.update({
                where: { id: created.id },
                data: { reference: `RFQ-${created.id}` }
            });
        }

        // 2. Handle categories
        if (data.categories && Array.isArray(data.categories) && data.categories.length > 0) {
            const newCategoriesData = data.categories.map((catString: string) => {
                const catId = parseInt(catString.replace('/api/categories/', ''));
                return {
                    demande_achat_id: created.id,
                    categorie_id: catId
                };
            }).filter((c: any) => !isNaN(c.categorie_id));

            if (newCategoriesData.length > 0) {
                await this.prisma.demande_ha_categories.createMany({
                    data: newCategoriesData
                });
            }
        }

        // 3. Handle attachements
        if (data.attachements && Array.isArray(data.attachements) && data.attachements.length > 0) {
            const newAttachementsData = data.attachements.map((attString: string) => {
                const attId = parseInt(attString.replace('/api/attachements/', ''));
                return {
                    demande_achat_id: created.id,
                    attachement_id: attId
                };
            }).filter((a: any) => !isNaN(a.attachement_id));

            if (newAttachementsData.length > 0) {
                await this.prisma.demande_achat_attachement.createMany({
                    data: newAttachementsData
                });
            }
        }

        // Charger la demande complète avec l'acheteur et l'utilisateur pour les emails
        const fullDemande = await this.prisma.demande_achat.findUnique({
            where: { id: created.id },
            include: {
                acheteur: {
                    include: {
                        user: true
                    }
                }
            }
        });

        if (fullDemande) {
            // Alerter l'administrateur
            await this.mailService.alertAdminNvRfs(fullDemande).catch(console.error);

            // Envoyer un accusé de réception à l'acheteur
            if (fullDemande.acheteur?.user?.email) {
                await this.mailService.sendRfqReceptionAcheteurEmail(
                    fullDemande.acheteur.user.email,
                    fullDemande
                ).catch(console.error);
            }
        }

        return this.findOne(created.id.toString());
    }

    async update(id: number, data: any) {
        // Fetch original to compare statuses
        const original = await this.prisma.demande_achat.findUnique({
            where: { id }
        });

        if (!original) throw new Error('Demande introuvable');

        const {
            categories,
            attachements,
            budget,
            motifRejet,
            autreCategories,
            statut,
            isPublic,
            is_internationnal,
            rejet_id,
            description,
            titre,
            fournisseurGagne,
            dateExpiration,
            isAnonyme,
            sendEmail,
            localisation
        } = data;

        let fournisseurGagneId = undefined;
        if (fournisseurGagne) {
            fournisseurGagneId = parseInt(fournisseurGagne.replace('/api/fournisseurs/', ''));
        }

        // ── AUTO-VALIDATION IA ──────────────────────────────────────────────────
        // Si le modérateur ne force pas un statut manuellement (statut non fourni ou
        // la demande est encore en attente), on recalcule le score IA.
        // Si score = 100 → validation automatique + diffusion immédiate.
        let autoValidatedByAI = false;
        let finalStatut = statut !== undefined ? parseInt(statut) : undefined;

        const texteAAnalyser = {
            titre: titre || original.titre || '',
            description: description || original.description || ''
        };
        const aiReport = this.validationService.validate(texteAAnalyser);

        if (aiReport.score === 100 && original.statut !== 1 && finalStatut !== 2) {
            // Le score est parfait et la RFQ n'est pas déjà validée ou rejetée manuellement
            finalStatut = 1;
            autoValidatedByAI = true;
            console.log(`[AI-Validation] ✅ Demande #${id} auto-validée (score IA: 100/100)`);
        }
        // ────────────────────────────────────────────────────────────────────────

        // 1. Mise à jour de la demande basique
        const updated = await this.prisma.demande_achat.update({
            where: { id },
            data: {
                statut: finalStatut,
                is_public: isPublic !== undefined ? Boolean(isPublic) : undefined,
                is_anonyme: isAnonyme !== undefined ? Boolean(isAnonyme) : undefined,
                is_alerted: sendEmail !== undefined ? Boolean(sendEmail) : undefined,
                localisation: localisation ? String(localisation) : undefined,
                motif_rejet_id: motifRejet ? parseInt(motifRejet) : (rejet_id ? parseInt(rejet_id) : undefined),
                budget: budget !== undefined ? parseFloat(budget) : undefined,
                autre_categories: autreCategories,
                description: description,
                titre: titre,
                fournisseur_gagne_id: fournisseurGagneId || undefined,
                date_expiration: dateExpiration ? new Date(dateExpiration) : undefined
            },
            include: {
                acheteur: { include: { user: true } }
            }
        });

        // 2. Mise à jour des catégories associées si fournies
        if (categories && Array.isArray(categories)) {
            // Supprimer les anciennes catégories
            await this.prisma.demande_ha_categories.deleteMany({
                where: { demande_achat_id: id }
            });

            // Insérer les nouvelles
            if (categories.length > 0) {
                const newCategoriesData = categories.map((catString: string) => {
                    const catId = parseInt(catString.replace('/api/categories/', ''));
                    return {
                        demande_achat_id: id,
                        categorie_id: catId
                    };
                }).filter(c => !isNaN(c.categorie_id));

                if (newCategoriesData.length > 0) {
                    await this.prisma.demande_ha_categories.createMany({
                        data: newCategoriesData
                    });
                }
            }
        }

        // 3. Logique d'envoi d'emails métier
        const ref = updated.reference || updated.id.toString();

        // A. Validée (Statut passe à 1) — manuellement ou par IA
        if (finalStatut === 1 && original.statut !== 1) {
            if (updated.acheteur?.user?.email) {
                await this.mailService.alerterAcheteur(updated.acheteur.user.email, ref);
            }
            // Diffuser aux fournisseurs
            this.diffuserAuxFournisseurs(updated.id);
        }

        // B. Refusée (Statut passe à 2)
        if (finalStatut === 2 && original.statut !== 2) {
            if (updated.acheteur?.user?.email) {
                await this.mailService.DemandeRefuserAcheteur(updated.acheteur.user.email, ref);
            }
        }

        // C. Sélection d'un gagnant
        if (fournisseurGagneId && original.fournisseur_gagne_id !== fournisseurGagneId) {
            const gagnant = await this.prisma.fournisseur.findUnique({
                where: { id: fournisseurGagneId },
                include: { user: true }
            });

            if (gagnant?.user?.email) {
                await this.mailService.alerterFrsGagner(gagnant.user.email, ref);
            }

            // Alerter les perdants
            const participations = await this.prisma.diffusion_demande.findMany({
                where: { demande_id: id },
                include: { fournisseur: { include: { user: true } } }
            });

            for (const p of participations) {
                if (p.fournisseur && p.fournisseur.id !== fournisseurGagneId && p.fournisseur.user?.email) {
                    await this.mailService.alerterFrsPerdue(p.fournisseur.user.email, ref);
                }
            }
        }

        // D. Mise à jour date d'expiration
        if (dateExpiration) {
            const newDate = new Date(dateExpiration);
            const oldDate = original.date_expiration ? new Date(original.date_expiration) : null;
            
            if (oldDate && newDate.getTime() !== oldDate.getTime()) {
                const isProlonged = newDate.getTime() > oldDate.getTime();
                const oldDateStr = oldDate.toLocaleDateString('fr-FR');
                const newDateStr = newDate.toLocaleDateString('fr-FR');
                
                const participations = await this.prisma.diffusion_demande.findMany({
                    where: { demande_id: id },
                    include: { fournisseur: { include: { user: true } } }
                });

                for (const p of participations) {
                    if (p.fournisseur && p.fournisseur.user?.email) {
                        const fournisseurName = p.fournisseur.user.first_name || p.fournisseur.societe || 'Fournisseur';
                        await this.mailService.sendUpdateExpirationRfqEmail(
                            p.fournisseur.user.email,
                            fournisseurName,
                            updated,
                            oldDateStr,
                            newDateStr,
                            isProlonged
                        ).catch(console.error);
                    }
                }
            }
        }

        return {
            ...updated,
            validationReport: { ...aiReport, autoValidatedByAI },
        };
    }

    async diffuserAuxFournisseurs(demandeId: number) {
        try {
            const demande = await this.prisma.demande_achat.findUnique({
                where: { id: demandeId },
                include: { demande_ha_categories: true }
            });
            if (!demande) return;

            const catIds = demande.demande_ha_categories.map(c => c.categorie_id);
            if (catIds.length === 0) return;

            // 1. Récupérer la liste noire de cet acheteur
            const blackListes = await this.prisma.black_listes.findMany({
                where: { acheteur_id: demande.acheteur_id, etat: true },
                select: { fournisseur_id: true }
            });
            // Filtrer les null au cas où et construire le tableau d'IDs
            const blacklistedIds = blackListes
                .map(b => b.fournisseur_id)
                .filter(id => id !== null) as number[];

            // 2. Trouver les fournisseurs associés à ces catégories (et non blacklistés)
            const fournisseurs = await this.prisma.fournisseur.findMany({
                where: {
                    is_complet: true,
                    id: { notIn: blacklistedIds }, // EXCLUSION DE LA BLACKLIST
                    fournisseur_categories: {
                        some: {
                            categorie_id: { in: catIds }
                        }
                    }
                },
                include: { user: true }
            });

            for (let frs of fournisseurs) {
                const fournisseur: any = frs;
                if (fournisseur.user?.email) {
                    // Send email only if the alert checkbox is checked
                    if (demande.is_alerted) {
                        await this.mailService.alerterFournisseurs(
                            fournisseur.user.email, 
                            demande.reference || demande.id.toString(), 
                            demande.titre, 
                            demande.description
                        );
                    }

                    // Tracer la diffusion
                    await this.prisma.diffusion_demande.create({
                        data: {
                            fournisseur_id: fournisseur.id,
                            demande_id: demandeId,
                            date_diffusion: new Date()
                        }
                    });
                }
            }
        } catch (error) {
            console.error('[DemandesAchatService] Erreur lors de la diffusion aux fournisseurs:', error);
        }
    }
}
