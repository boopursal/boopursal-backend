import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AcheteursService {
    constructor(private readonly prisma: PrismaService) { }

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
                    user: true,
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
                user: true,
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
}
