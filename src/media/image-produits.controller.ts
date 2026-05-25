import { Controller, Post, UseInterceptors, UploadedFile, Delete, Param, ParseIntPipe } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { MediaService } from './media.service';

@Controller('image_produits')
export class ImageProduitsController {
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
                return cb(null, `${randomName}${extname(file.originalname)}`);
            }
        })
    }))
    async uploadFile(@UploadedFile() file: any) {
        const url = file.filename;
        const savedImage = await this.mediaService.createImageProduit({
            url: `produits/${url}`
        });

        return {
            ...savedImage,
            '@id': `/api/image_produits/${savedImage.id}`,
            '@type': 'ImageProduit'
        };
    }

    @Delete(':id')
    async remove(@Param('id', ParseIntPipe) id: number) {
        await this.mediaService.deleteImageProduit(id);
        return { success: true, id };
    }
}
