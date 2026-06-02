import { Controller, Post, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage, memoryStorage } from 'multer';
import { extname } from 'path';
import { MediaService } from './media.service';
import { put } from '@vercel/blob';

const isProduction = process.env.NODE_ENV === 'production';

@Controller('attachements')
export class AttachementsController {
    constructor(private readonly mediaService: MediaService) { }

    @Post()
    @UseInterceptors(FileInterceptor('file', {
        storage: isProduction
            // En production (Vercel): garder le fichier en mémoire pour uploader vers Vercel Blob
            ? memoryStorage()
            // En local: sauvegarder sur le disque dans public/attachement/demandeAchat
            : diskStorage({
                destination: './public/attachement/demandeAchat',
                filename: (req, file, cb) => {
                    const randomName = Array(32).fill(null)
                        .map(() => (Math.round(Math.random() * 16)).toString(16))
                        .join('');
                    return cb(null, `${randomName}${extname(file.originalname)}`);
                }
            })
    }))
    async uploadFile(@UploadedFile() file: any) {
        let fileUrl: string;

        if (isProduction) {
            // Upload vers Vercel Blob en production
            const randomName = Array(32).fill(null)
                .map(() => (Math.round(Math.random() * 16)).toString(16))
                .join('');
            const filename = `attachements/demandeAchat/${randomName}${extname(file.originalname)}`;

            const blob = await put(filename, file.buffer, {
                access: 'public',
                contentType: file.mimetype,
            });

            fileUrl = blob.url; // URL complète publique, ex: https://xxx.public.blob.vercel-storage.com/...
        } else {
            // En local: URL relative (préfixe ajouté côté frontend via URL_SITE)
            fileUrl = `attachement/demandeAchat/${file.filename}`;
        }

        const savedAttachement = await this.mediaService.createAttachement({
            url: fileUrl,
            fileSize: file.size,
            type: file.mimetype
        });

        return {
            ...savedAttachement,
            '@id': `/api/attachements/${savedAttachement.id}`,
            '@type': 'Attachement',
            name: file.originalname,
            url: fileUrl
        };
    }
}
