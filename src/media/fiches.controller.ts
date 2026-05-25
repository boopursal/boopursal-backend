import { Controller, Post, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { MediaService } from './media.service';

@Controller('fiches')
export class FichesController {
    constructor(private readonly mediaService: MediaService) { }

    @Post()
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination: (req, file, cb) => {
               const path = process.env.NODE_ENV === 'production' ? '/tmp' : './public/images/produits';
               cb(null, path);
            },
            filename: (req, file, cb) => {
                const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
                return cb(null, `fiche-${randomName}${extname(file.originalname)}`);
            }
        })
    }))
    async uploadFile(@UploadedFile() file: any) {
        const url = file.filename;
        const savedFiche = await this.mediaService.createFiche({
            url: `produits/${url}`,
            fileSize: file.size,
            type: file.mimetype
        });

        return {
            ...savedFiche,
            '@id': `/api/fiches/${savedFiche.id}`,
            '@type': 'Fiche'
        };
    }
}
