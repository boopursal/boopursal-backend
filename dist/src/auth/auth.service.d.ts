import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
export declare class AuthService {
    private prisma;
    private jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
    login(email: string, password: string): Promise<{
        token: string;
        user: {
            role: string;
            from: string;
            data: {
                id: any;
                displayName: any;
                email: any;
                firstName: any;
                lastName: any;
                type: string;
                role: string;
                roles: string[];
                photoURL: string;
                settings: {};
                shortcuts: any[];
            };
        };
    }>;
    private formatUser;
    validateUser(payload: any): Promise<{
        role: string;
        from: string;
        data: {
            id: any;
            displayName: any;
            email: any;
            firstName: any;
            lastName: any;
            type: string;
            role: string;
            roles: string[];
            photoURL: string;
            settings: {};
            shortcuts: any[];
        };
    }>;
}
