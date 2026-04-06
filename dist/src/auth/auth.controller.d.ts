import { AuthService } from './auth.service';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    login(loginDto: {
        email: string;
        password: string;
    }): Promise<{
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
    getCurrentUser(req: any): {
        user: any;
        token: any;
    };
    getProfile(req: any): any;
}
