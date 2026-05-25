import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AbonnementsService {
    constructor(private readonly prisma: PrismaService) { }

    async findAll(page = 1, limit = 20, search?: any[]) {
        const skip = (page - 1) * limit;

        const where: any = {};
        if (search && Array.isArray(search)) {
            search.forEach(f => {
                if (f.id === 'reference') where.reference = { contains: f.value };
                if (f.id === 'fournisseur.societe') where.fournisseur = { societe: { contains: f.value } };
            });
        }

        const [data, total] = await Promise.all([
            this.prisma.abonnement.findMany({
                where,
                skip,
                take: limit,
                include: {
                    fournisseur: { select: { id: true, societe: true } },
                    offre: true,
                    paiement: true,
                    commercial: { include: { user: true } },
                    currency: true,
                    abonnement_sous_secteur: {
                        include: {
                            sous_secteur: {
                                include: {
                                    secteur: true
                                }
                            }
                        }
                    }
                },
                orderBy: { created: 'desc' },
            }),
            this.prisma.abonnement.count({ where }),
        ]);

        const flattenedData = data.map(item => ({
            ...item,
            '@id': `/api/abonnements/${item.id}`,
            mode: item.paiement ? {
                ...item.paiement,
                '@id': `/api/paiements/${item.paiement.id}`,
            } : null,
            offre: item.offre ? {
                ...item.offre,
                prixMad: item.offre.prix_mad,
                prixEur: item.offre.prix_eur,
                nbActivite: item.offre.nb_activite,
                focusProduit: item.offre.focus_produit,
                nbPageCatalogue: item.offre.nb_page_catalogue,
                hasCommercial: item.offre.has_commercial,
                hasBanner: item.offre.has_banner,
                '@id': `/api/offres/${item.offre.id}`,
            } : null,
            fournisseur: item.fournisseur ? {
                ...item.fournisseur,
                '@id': `/api/fournisseurs/${item.fournisseur.id}`,
            } : null,
            sousSecteurs: item.abonnement_sous_secteur.map(ss => ({
                ...ss.sous_secteur,
                '@id': `/api/sous_secteurs/${ss.sous_secteur.id}`,
                secteur: ss.sous_secteur.secteur ? {
                    '@id': `/api/secteurs/${ss.sous_secteur.secteur.id}`,
                    name: ss.sous_secteur.secteur.name,
                } : null,
            })),
        }));

        return {
            'hydra:member': flattenedData,
            'hydra:totalItems': total,
        };
    }

    async findOne(id: number) {
        const item = await this.prisma.abonnement.findUnique({
            where: { id },
            include: {
                fournisseur: { include: { user: true, currency: true } },
                offre: true,
                paiement: true,
                commercial: { include: { user: true } },
                currency: true,
                duree: true,
                abonnement_sous_secteur: {
                    include: {
                        sous_secteur: {
                            include: {
                                secteur: true
                            }
                        }
                    }
                }
            },
        });

        if (!item) return null;

        return {
            ...item,
            '@id': `/api/abonnements/${item.id}`,
            mode: item.paiement ? {
                ...item.paiement,
                '@id': `/api/paiements/${item.paiement.id}`,
            } : null,
            offre: item.offre ? {
                ...item.offre,
                prixMad: item.offre.prix_mad,
                prixEur: item.offre.prix_eur,
                nbActivite: item.offre.nb_activite,
                focusProduit: item.offre.focus_produit,
                nbPageCatalogue: item.offre.nb_page_catalogue,
                hasCommercial: item.offre.has_commercial,
                hasBanner: item.offre.has_banner,
                '@id': `/api/offres/${item.offre.id}`,
            } : null,
            fournisseur: item.fournisseur ? {
                ...item.fournisseur,
                '@id': `/api/fournisseurs/${item.fournisseur.id}`,
                currency: item.fournisseur.currency ? {
                    ...item.fournisseur.currency,
                    '@id': `/api/currencies/${item.fournisseur.currency.id}`,
                    name: item.fournisseur.currency.currency,
                } : null,
            } : null,
            duree: item.duree ? {
                ...item.duree,
                '@id': `/api/durees/${item.duree.id}`,
            } : null,
            currency: item.currency ? {
                ...item.currency,
                '@id': `/api/currencies/${item.currency.id}`,
                name: item.currency.currency,
            } : null,
            sousSecteurs: item.abonnement_sous_secteur.map(ss => ({
                ...ss.sous_secteur,
                '@id': `/api/sous_secteurs/${ss.sous_secteur.id}`,
                secteur: ss.sous_secteur.secteur ? {
                    '@id': `/api/secteurs/${ss.sous_secteur.secteur.id}`,
                    name: ss.sous_secteur.secteur.name,
                } : null,
            })),
        };
    }

    async findAllOffres() {
        const data = await this.prisma.offre.findMany();
        return {
            'hydra:member': data.map(o => ({
                ...o,
                prixMad: o.prix_mad,
                prixEur: o.prix_eur,
                nbActivite: o.nb_activite,
                focusProduit: o.focus_produit,
                nbPageCatalogue: o.nb_page_catalogue,
                hasCommercial: o.has_commercial,
                hasBanner: o.has_banner,
                '@id': `/api/offres/${o.id}`,
                '@type': 'Offre',
            })),
            'hydra:totalItems': data.length,
        };
    }

    async findAllDurees() {
        const data = await this.prisma.duree.findMany({
            orderBy: { name: 'asc' },
        });
        return {
            'hydra:member': data.map(d => ({
                ...d,
                '@id': `/api/durees/${d.id}`,
                '@type': 'Duree',
            })),
            'hydra:totalItems': data.length,
        };
    }

    async getStats() {
        const now = new Date();
        const [total, actifs, ca_total] = await Promise.all([
            this.prisma.abonnement.count(),
            this.prisma.abonnement.count({ where: { statut: true, expired: { gte: now } } }),
            this.prisma.abonnement.aggregate({
                _sum: {
                    prix: true
                }
            }),
        ]);

        return {
            total,
            actifs,
            ca_total: ca_total._sum.prix || 0
        };
    }

    private extractSousSecteurIds(sousSecteurs: any): number[] {
        if (!sousSecteurs || !Array.isArray(sousSecteurs)) return [];
        return sousSecteurs
            .map((ss: any) => {
                if (typeof ss === 'number') return ss;
                let idStr = '';
                if (typeof ss === 'string') {
                    idStr = ss.split('/').pop() || '';
                } else if (typeof ss === 'object' && ss !== null) {
                    if (ss.id !== undefined) {
                        if (typeof ss.id === 'number') return ss.id;
                        idStr = String(ss.id);
                    } else if (ss.value !== undefined) {
                        if (typeof ss.value === 'number') return ss.value;
                        idStr = String(ss.value).split('/').pop() || '';
                    }
                }
                const parsed = parseInt(idStr, 10);
                return isNaN(parsed) ? null : parsed;
            })
            .filter((id: number | null): id is number => id !== null);
    }

    private sanitizeData(data: any) {
        const { 
            '@id': _, 
            '@type': __, 
            fournisseur, 
            offre, 
            mode, 
            paiement, 
            sousSecteurs, 
            currency, 
            duree, 
            ...cleanData 
        } = data;
        
        if (cleanData.created && typeof cleanData.created === 'string') cleanData.created = new Date(cleanData.created);
        if (cleanData.expired && typeof cleanData.expired === 'string') cleanData.expired = new Date(cleanData.expired);
        if (cleanData.date_peiment && typeof cleanData.date_peiment === 'string') cleanData.date_peiment = new Date(cleanData.date_peiment);
        
        if (cleanData.statut !== undefined) cleanData.statut = Boolean(cleanData.statut);
        if (cleanData.type !== undefined) cleanData.type = Boolean(cleanData.type);

        // Ensure numerical fields are parsed correctly
        if (cleanData.prix !== undefined) cleanData.prix = parseFloat(cleanData.prix) || 0;
        if (cleanData.remise !== undefined) cleanData.remise = parseFloat(cleanData.remise) || 0;
        if (cleanData.prix_admin !== undefined) cleanData.prix_admin = parseFloat(cleanData.prix_admin) || 0;

        return cleanData;
    }

    private async prepareAbonnementFields(data: any, existingId?: number) {
        let fId = 0;
        let oId = 0;
        let dId = 0;

        const getNumericId = (val: any) => {
            if (typeof val === 'number') return val;
            if (typeof val === 'string') {
                const parts = val.split('/');
                const parsed = parseInt(parts[parts.length - 1], 10);
                return isNaN(parsed) ? 0 : parsed;
            }
            if (typeof val === 'object' && val !== null) {
                if (val.id !== undefined) {
                    return typeof val.id === 'number' ? val.id : parseInt(String(val.id), 10) || 0;
                }
                if (val.value !== undefined) {
                    if (typeof val.value === 'number') return val.value;
                    if (typeof val.value === 'string') {
                        const parts = val.value.split('/');
                        const parsed = parseInt(parts[parts.length - 1], 10);
                        return isNaN(parsed) ? 0 : parsed;
                    }
                }
            }
            return 0;
        };

        let isUpdate = !!existingId;
        let existing: any = null;
        if (isUpdate && existingId) {
            existing = await this.prisma.abonnement.findUnique({
                where: { id: existingId },
                include: { fournisseur: { include: { currency: true } }, offre: true, duree: true, currency: true }
            });
        }

        fId = getNumericId(data.fournisseur) || (existing?.fournisseur_id || 0);
        oId = getNumericId(data.offre) || (existing?.offre_id || 0);
        dId = getNumericId(data.duree) || (existing?.duree_id || 0);

        const [fournisseur, offre, duree] = await Promise.all([
            this.prisma.fournisseur.findUnique({
                where: { id: fId },
                include: { currency: true }
            }),
            this.prisma.offre.findUnique({ where: { id: oId } }),
            this.prisma.duree.findUnique({ where: { id: dId } })
        ]);

        if (!fournisseur || !offre || !duree) {
            throw new Error('Fournisseur, Offre or Duree not found');
        }

        let currencyName = 'MAD';
        if (fournisseur.currency && fournisseur.currency.currency !== 'MAD') {
            currencyName = 'EUR';
        }

        const currency = await this.prisma.currency.findFirst({
            where: { currency: currencyName }
        });

        let prixOffre = currencyName === 'MAD' ? offre.prix_mad : offre.prix_eur;
        let remiseOffre = duree.remise || 0;
        let dureeMonths = duree.name; 

        let prixHT = prixOffre * dureeMonths;

        if (remiseOffre > 0) {
            prixHT = prixHT - (prixHT * remiseOffre / 100);
        }

        let adminRemise = data.remise !== undefined ? parseFloat(data.remise) : (existing?.remise || 0);
        if (isNaN(adminRemise)) adminRemise = 0;
        if (adminRemise > 0) {
            prixHT = prixHT - adminRemise;
        }

        let ttc = 0;
        let prixAdmin = 0;

        if (currencyName === 'MAD') {
            ttc = prixHT + (prixHT * 0.2); 
            prixAdmin = ttc;
        } else {
            ttc = prixHT; 
            prixAdmin = prixHT * 10;
        }

        let reference = existing?.reference;
        if (!reference) {
            const currentYear = new Date().getFullYear();
            const count = await this.prisma.abonnement.count({
                where: {
                    created: {
                        gte: new Date(`${currentYear}-01-01T00:00:00.000Z`),
                        lt: new Date(`${currentYear + 1}-01-01T00:00:00.000Z`),
                    }
                }
            });
            reference = `Ab-${currentYear}-${count + 1}`;
        }

        const cleanData = this.sanitizeData(data);

        const computed: any = {
            ...cleanData,
            reference,
            prix: ttc,
            prix_admin: prixAdmin,
            remise: adminRemise,
        };

        computed.fournisseur = { connect: { id: fId } };
        computed.offre = { connect: { id: oId } };
        computed.duree = { connect: { id: dId } };
        if (currency) {
            computed.currency = { connect: { id: currency.id } };
        }

        // Handle mode / paiement
        const modeOrPaiement = data.mode || data.paiement;
        if (modeOrPaiement) {
            const mId = getNumericId(modeOrPaiement);
            if (mId && !isNaN(mId)) computed.paiement = { connect: { id: mId } };
        } else if (existing?.mode_id) {
            computed.paiement = { connect: { id: existing.mode_id } };
        }

        let isStatutTrue = data.statut === true || data.statut === 'true' || data.statut === 1;
        let wasStatutTrue = existing?.statut === true;

        if (!isUpdate) {
            computed.created = new Date();
            computed.type = data.type === true || data.type === 'true' || data.type === 1;
            if (isStatutTrue) {
                computed.date_peiment = new Date();
                if (computed.type) {
                    const old = await this.prisma.abonnement.findFirst({
                        where: { fournisseur_id: fId, statut: true },
                        orderBy: { expired: 'desc' }
                    });
                    if (old && old.expired) {
                        const newExpired = new Date(old.expired);
                        newExpired.setMonth(newExpired.getMonth() + dureeMonths);
                        computed.expired = newExpired;
                    } else {
                        const newExpired = new Date();
                        newExpired.setMonth(newExpired.getMonth() + dureeMonths);
                        computed.expired = newExpired;
                    }
                } else {
                    const newExpired = new Date();
                    newExpired.setMonth(newExpired.getMonth() + dureeMonths);
                    computed.expired = newExpired;
                }
            }
        } else {
            const type = data.type !== undefined ? (data.type === true || data.type === 'true' || data.type === 1) : (existing?.type || false);
            computed.type = type;

            if (isStatutTrue && !wasStatutTrue && !existing?.date_peiment) {
                computed.date_peiment = new Date();
                if (type) {
                    const old = await this.prisma.abonnement.findFirst({
                        where: { fournisseur_id: fId, statut: true, id: { not: existingId } },
                        orderBy: { expired: 'desc' }
                    });
                    const now = new Date();
                    if (old && old.expired && new Date(old.expired) > now) {
                        const newExpired = new Date(old.expired);
                        newExpired.setMonth(newExpired.getMonth() + dureeMonths);
                        computed.expired = newExpired;
                    } else {
                        const newExpired = new Date();
                        newExpired.setMonth(newExpired.getMonth() + dureeMonths);
                        computed.expired = newExpired;
                    }
                } else {
                    const newExpired = new Date();
                    newExpired.setMonth(newExpired.getMonth() + dureeMonths);
                    computed.expired = newExpired;
                }
            }
        }

        return computed;
    }

    async create(data: any) {
        try {
            const cleanData = await this.prepareAbonnementFields(data);
            const created = await this.prisma.abonnement.create({ data: cleanData });
            
            const sousSecteurIds = this.extractSousSecteurIds(data.sousSecteurs);
            if (sousSecteurIds.length > 0) {
                await this.prisma.abonnement_sous_secteur.createMany({
                    data: sousSecteurIds.map(id => ({
                        abonnement_id: created.id,
                        sous_secteur_id: id
                    }))
                });
            }

            return this.findOne(created.id);
        } catch (error) {
            console.error('[ABONNEMENTS_SERVICE] Error creating abonnement:', error);
            throw error;
        }
    }

    async update(id: number, data: any) {
        try {
            const cleanData = await this.prepareAbonnementFields(data, id);
            const updated = await this.prisma.abonnement.update({
                where: { id },
                data: cleanData
            });

            const sousSecteurIds = this.extractSousSecteurIds(data.sousSecteurs);
            if (sousSecteurIds.length > 0) {
                await this.prisma.abonnement_sous_secteur.deleteMany({
                    where: { abonnement_id: id }
                });
                await this.prisma.abonnement_sous_secteur.createMany({
                    data: sousSecteurIds.map(ssId => ({
                        abonnement_id: id,
                        sous_secteur_id: ssId
                    }))
                });
            }

            return this.findOne(id);
        } catch (error) {
            console.error('[ABONNEMENTS_SERVICE] Error updating abonnement:', error);
            throw error;
        }
    }
}
