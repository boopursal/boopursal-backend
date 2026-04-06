import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AvatarsService {
    constructor(private readonly prisma: PrismaService) { }

    async create(data: { url: string; name: string }) {
        return (this.prisma.avatar as any).create({
            data: {
                url: data.url,
                name: data.name,
                created: new Date()
            }
        });
    }

    async findOne(id: number) {
        return this.prisma.avatar.findUnique({
            where: { id }
        });
    }
}
