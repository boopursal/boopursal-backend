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
            destination: './public/images/avatars',
            filename: (req, file, cb) => {
                const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
                return cb(null, `${randomName}${extname(file.originalname)}`);
            }
        })
    }))
    async uploadFile(@UploadedFile() file: any) {
        // file.path contains something like "public\images\avatars\..."
        // but we want the URL to be relative to the public root for serving
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
