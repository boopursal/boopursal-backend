import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CommercialsService {
    constructor(private readonly prisma: PrismaService) { }

    private formatParent(parent: any) {
        if (!parent) return null;
        return {
            '@id': `/api/users/${parent.id}`,
            id: parent.id,
            firstName: parent.first_name,
            lastName: parent.last_name,
            avatar: parent.avatar ? {
                '@id': `/api/avatars/${parent.avatar.id}`,
                url: parent.avatar.url,
            } : null,
        };
    }

    async findAll(page = 1, limit = 20, search?: string) {
        const skip = (page - 1) * limit;

        const where: any = {};
        if (search) {
            where.user = {
                OR: [
                    { first_name: { contains: search } },
                    { last_name: { contains: search } },
                    { email: { contains: search } },
                ],
            };
        }

        const [data, total] = await Promise.all([
            this.prisma.commercial.findMany({
                where,
                skip,
                take: limit,
                include: {
                    user: {
                        include: {
                            avatar: true,
                            user: {
                                include: {
                                    avatar: true,
                                }
                            }
                        },
                    },
                    commercial_ville: {
                        include: {
                            ville: {
                                include: {
                                    pays: true,
                                },
                            },
                        },
                    },
                },
                orderBy: { id: 'desc' },
            }),
            this.prisma.commercial.count({ where }),
        ]);

        return {
            'hydra:member': data.map(item => ({
                ...item,
                '@id': `/api/commercials/${item.id}`,
                '@type': 'Commercial',
                firstName: item.user?.first_name,
                lastName: item.user?.last_name,
                email: item.user?.email,
                phone: item.user?.phone,
                adresse1: item.user?.adresse1,
                adresse2: item.user?.adresse2,
                codepostal: item.user?.codepostal,
                isactif: item.user?.isactif,
                created: item.user?.created,
                parent1: this.formatParent(item.user?.user),
                avatar: item.user?.avatar ? {
                    '@id': `/api/avatars/${item.user.avatar.id}`,
                    url: item.user.avatar.url,
                } : null,
                villes: item.commercial_ville?.map(cv => ({
                    '@id': `/api/villes/${cv.ville.id}`,
                    id: cv.ville.id,
                    name: cv.ville.name,
                    pays: cv.ville.pays ? {
                        '@id': `/api/pays/${cv.ville.pays.id}`,
                        id: cv.ville.pays.id,
                        name: cv.ville.pays.name,
                    } : null,
                })),
            })),
            'hydra:totalItems': total,
        };
    }

    async findOne(id: number) {
        const item = await this.prisma.commercial.findUnique({
            where: { id },
            include: {
                user: {
                    include: {
                        avatar: true,
                        user: {
                            include: {
                                avatar: true,
                            }
                        }
                    },
                },
                commercial_ville: {
                    include: {
                        ville: {
                            include: {
                                pays: true,
                            },
                        },
                    },
                },
            },
        });

        if (!item) return null;

        return {
            ...item,
            '@id': `/api/commercials/${item.id}`,
            '@type': 'Commercial',
            firstName: item.user?.first_name,
            lastName: item.user?.last_name,
            email: item.user?.email,
            phone: item.user?.phone,
            adresse1: item.user?.adresse1,
            adresse2: item.user?.adresse2,
            codepostal: item.user?.codepostal,
            isactif: item.user?.isactif,
            parent1: this.formatParent(item.user?.user),
            avatar: item.user?.avatar ? {
                '@id': `/api/avatars/${item.user.avatar.id}`,
                url: item.user.avatar.url,
            } : null,
            villes: item.commercial_ville?.map(cv => ({
                value: `/api/villes/${cv.ville.id}`,
                label: cv.ville.name,
                pays: cv.ville.pays ? {
                    '@id': `/api/pays/${cv.ville.pays.id}`,
                    name: cv.ville.pays.name,
                } : null,
            })),
        };
    }
}
