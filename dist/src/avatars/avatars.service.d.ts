import { PrismaService } from '../prisma/prisma.service';
export declare class AvatarsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(data: {
        url: string;
        name: string;
    }): Promise<any>;
    findOne(id: number): Promise<{
        id: number;
        url: string | null;
    }>;
}
