import { Controller, Post, UseInterceptors, UploadedFile, HttpException, HttpStatus } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage, memoryStorage } from 'multer';
import { extname } from 'path';
import { AvatarsService } from './avatars.service';
import { put } from '@vercel/blob';

const isProduction = !!process.env.VERCEL || process.env.NODE_ENV === 'production';

@Controller('avatars')
export class AvatarsController {
    constructor(private readonly avatarsService: AvatarsService) { }

    @Post()
    @UseInterceptors(FileInterceptor('file', {
        storage: isProduction
            ? memoryStorage()
            : diskStorage({
                destination: './public/images/avatars',
                filename: (req, file, cb) => {
                    const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
                    return cb(null, `${randomName}${extname(file.originalname)}`);
                }
            })
    }))
    async uploadFile(@UploadedFile() file: any) {
        try {
            if (!file) throw new Error("Aucun fichier reçu");

            let fileUrl: string;

            if (isProduction) {
                if (!process.env.BLOB_READ_WRITE_TOKEN) {
                    throw new Error("BLOB_READ_WRITE_TOKEN is missing");
                }
                if (!file.buffer) {
                    throw new Error("Fichier introuvable en mémoire");
                }
                const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
                const filename = `avatars/${randomName}${extname(file.originalname)}`;
                const blob = await put(filename, file.buffer, {
                    access: 'public',
                    contentType: file.mimetype,
                });
                fileUrl = blob.url;
            } else {
                fileUrl = `avatars/${file.filename}`;
            }

            const savedAvatar = await this.avatarsService.create({
                url: fileUrl,
                name: file.originalname
            });

            return {
                ...savedAvatar,
                '@id': `/api/avatars/${savedAvatar.id}`,
                '@type': 'Avatar'
            };
        } catch (error) {
            console.error('=== ERREUR UPLOAD AVATAR ===', error);
            throw new HttpException(
                error instanceof Error ? error.message : 'Erreur interne lors de l\'upload',
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }
}
