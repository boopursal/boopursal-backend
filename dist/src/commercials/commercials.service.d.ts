import { PrismaService } from '../prisma/prisma.service';
export declare class CommercialsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    private formatParent;
    findAll(page?: number, limit?: number, search?: string): Promise<{
        'hydra:member': {
            '@id': string;
            '@type': string;
            firstName: string;
            lastName: string;
            email: string;
            phone: string;
            adresse1: string;
            adresse2: string;
            codepostal: number;
            isactif: boolean;
            created: Date;
            parent1: {
                '@id': string;
                id: any;
                firstName: any;
                lastName: any;
                avatar: {
                    '@id': string;
                    url: any;
                };
            };
            avatar: {
                '@id': string;
                url: string;
            };
            villes: {
                '@id': string;
                id: number;
                name: string;
                pays: {
                    '@id': string;
                    id: number;
                    name: string;
                };
            }[];
            user: {
                user: {
                    avatar: {
                        id: number;
                        url: string | null;
                    };
                } & {
                    id: number;
                    adresse1: string | null;
                    adresse2: string | null;
                    codepostal: number | null;
                    phone: string;
                    email: string;
                    password: string;
                    del: boolean;
                    isactif: boolean;
                    created: Date;
                    first_name: string;
                    last_name: string;
                    discr: string;
                    roles: string;
                    password_change_date: number | null;
                    parent1: number | null;
                    confirmation_token: string | null;
                    avatar_id: number | null;
                    redirect: string;
                    password_reset_date: Date | null;
                    forgot_token: string | null;
                };
                avatar: {
                    id: number;
                    url: string | null;
                };
            } & {
                id: number;
                adresse1: string | null;
                adresse2: string | null;
                codepostal: number | null;
                phone: string;
                email: string;
                password: string;
                del: boolean;
                isactif: boolean;
                created: Date;
                first_name: string;
                last_name: string;
                discr: string;
                roles: string;
                password_change_date: number | null;
                parent1: number | null;
                confirmation_token: string | null;
                avatar_id: number | null;
                redirect: string;
                password_reset_date: Date | null;
                forgot_token: string | null;
            };
            commercial_ville: ({
                ville: {
                    pays: {
                        id: number;
                        del: boolean;
                        name: string;
                        slug: string;
                    };
                } & {
                    id: number;
                    del: boolean;
                    name: string;
                    pays_id: number | null;
                    slug: string;
                };
            } & {
                ville_id: number;
                commercial_id: number;
            })[];
            id: number;
        }[];
        'hydra:totalItems': number;
    }>;
    findOne(id: number): Promise<{
        '@id': string;
        '@type': string;
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
        adresse1: string;
        adresse2: string;
        codepostal: number;
        isactif: boolean;
        parent1: {
            '@id': string;
            id: any;
            firstName: any;
            lastName: any;
            avatar: {
                '@id': string;
                url: any;
            };
        };
        avatar: {
            '@id': string;
            url: string;
        };
        villes: {
            value: string;
            label: string;
            pays: {
                '@id': string;
                name: string;
            };
        }[];
        user: {
            user: {
                avatar: {
                    id: number;
                    url: string | null;
                };
            } & {
                id: number;
                adresse1: string | null;
                adresse2: string | null;
                codepostal: number | null;
                phone: string;
                email: string;
                password: string;
                del: boolean;
                isactif: boolean;
                created: Date;
                first_name: string;
                last_name: string;
                discr: string;
                roles: string;
                password_change_date: number | null;
                parent1: number | null;
                confirmation_token: string | null;
                avatar_id: number | null;
                redirect: string;
                password_reset_date: Date | null;
                forgot_token: string | null;
            };
            avatar: {
                id: number;
                url: string | null;
            };
        } & {
            id: number;
            adresse1: string | null;
            adresse2: string | null;
            codepostal: number | null;
            phone: string;
            email: string;
            password: string;
            del: boolean;
            isactif: boolean;
            created: Date;
            first_name: string;
            last_name: string;
            discr: string;
            roles: string;
            password_change_date: number | null;
            parent1: number | null;
            confirmation_token: string | null;
            avatar_id: number | null;
            redirect: string;
            password_reset_date: Date | null;
            forgot_token: string | null;
        };
        commercial_ville: ({
            ville: {
                pays: {
                    id: number;
                    del: boolean;
                    name: string;
                    slug: string;
                };
            } & {
                id: number;
                del: boolean;
                name: string;
                pays_id: number | null;
                slug: string;
            };
        } & {
            ville_id: number;
            commercial_id: number;
        })[];
        id: number;
    }>;
}
