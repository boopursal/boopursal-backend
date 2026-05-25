import { Controller, Post, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { MediaService } from './media.service';

@Controller('attachements')
export class AttachementsController {
    constructor(private readonly mediaService: MediaService) { }

    @Post()
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination: (req, file, cb) => {
               const path = process.env.NODE_ENV === 'production' ? '/tmp' : './public/attachement/demandeAchat';
               cb(null, path);
            },
            filename: (req, file, cb) => {
                const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
                return cb(null, `${randomName}${extname(file.originalname)}`);
            }
        })
    }))
    async uploadFile(@UploadedFile() file: any) {
        const url = file.filename;
        const savedAttachement = await this.mediaService.createAttachement({
            url: url,
            fileSize: file.size,
            type: file.mimetype
        });

        return {
            ...savedAttachement,
            '@id': `/api/attachements/${savedAttachement.id}`,
            '@type': 'Attachement',
            name: file.originalname
        };
    }
}
