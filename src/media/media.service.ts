import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MediaService {
    constructor(private readonly prisma: PrismaService) { }

    async createImageProduit(data: { url: string }) {
        return this.prisma.image_produit.create({
            data: {
                url: data.url,
            }
        });
    }

    async createFiche(data: { url: string; fileSize: number; type: string }) {
        return this.prisma.fiche.create({
            data: {
                url: data.url,
                file_size: data.fileSize,
                type: data.type
            }
        });
    }

    async createAttachement(data: { url: string; fileSize: number; type: string }) {
        return this.prisma.attachement.create({
            data: {
                url: data.url,
                file_size: data.fileSize,
                type: data.type
            }
        });
    }

    async deleteImageProduit(id: number) {
        return this.prisma.image_produit.delete({
            where: { id }
        });
    }
}
