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

    async deleteAttachement(id: number) {
        // First, get the attachment to retrieve its URL (needed to delete from Vercel Blob)
        const att = await this.prisma.attachement.findUnique({ where: { id } });
        if (!att) return null;

        // If it's a Vercel Blob URL, delete from blob storage too
        if (att.url?.startsWith('http') && process.env.BLOB_READ_WRITE_TOKEN) {
            try {
                const { del } = await import('@vercel/blob');
                await del(att.url);
            } catch (e) {
                console.warn('[deleteAttachement] Could not delete blob:', e?.message);
            }
        }

        // Remove from DB (cascade will remove demande_achat_attachement links)
        return this.prisma.attachement.delete({ where: { id } });
    }
}
