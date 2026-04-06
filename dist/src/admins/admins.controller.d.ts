import { AdminsService } from './admins.service';
export declare class AdminsController {
    private readonly adminsService;
    constructor(adminsService: AdminsService);
    findAll(page?: string, limit?: string, search?: string): Promise<{
        'hydra:member': {
            firstName: string;
            lastName: string;
            email: string;
            isactif: boolean;
            user: {
                id: number;
                adresse1: string | null;
                adresse2: string | null;
                codepostal: number | null;
                phone: string;
                email: string;
                password: string;
                del: boolean;
                isactif: boolean;
                created: Date;
                first_name: string;
                last_name: string;
                discr: string;
                roles: string;
                password_change_date: number | null;
                parent1: number | null;
                confirmation_token: string | null;
                avatar_id: number | null;
                redirect: string;
                password_reset_date: Date | null;
                forgot_token: string | null;
            };
            id: number;
        }[];
        'hydra:totalItems': number;
    }>;
}
