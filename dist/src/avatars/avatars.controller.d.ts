import { AvatarsService } from './avatars.service';
export declare class AvatarsController {
    private readonly avatarsService;
    constructor(avatarsService: AvatarsService);
    uploadFile(file: any): Promise<any>;
}
