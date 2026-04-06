import { Controller, Post, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { AvatarsService } from './avatars.service';

@Controller('avatars')
export class AvatarsController {
    constructor(private readonly avatarsService: AvatarsService) { }

    @Post()
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            // Vercel only allows writing to /tmp
            destination: (req, file, cb) => {
               const path = process.env.NODE_ENV === 'production' ? '/tmp' : './public/images/avatars';
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
        const savedAvatar = await this.avatarsService.create({
            url: `avatars/${url}`,
            name: file.originalname
        });

        return {
            ...savedAvatar,
            '@id': `/api/avatars/${savedAvatar.id}`,
            '@type': 'Avatar'
        };
    }
}
