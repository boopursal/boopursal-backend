import { Controller, Post, Body, HttpCode, HttpStatus, Get, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';

@Controller()
export class AuthController {
    constructor(private authService: AuthService) { }

    /**
     * POST /api/login_check
     * Identique à Symfony Guard / LexikJWT
     */
    @Post('login_check')
    @HttpCode(HttpStatus.OK)
    async login(@Body() loginDto: { email: string; password: string }) {
        return this.authService.login(loginDto.email, loginDto.password);
    }

    /**
     * GET /api/currentUser
     * Retourne l'utilisateur actuellement authentifié (requis par jwtService.js)
     */
    @UseGuards(AuthGuard('jwt'))
    @Get('currentUser')
    getCurrentUser(@Request() req) {
        // Le service renvoie déjà le format attendu { user: ..., token: ... } si besoin
        // Ici on renforce la compatibilité
        return {
            user: req.user,
            token: req.headers.authorization?.split(' ')[1]
        };
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('auth/profile')
    getProfile(@Request() req) {
        return req.user;
    }
}
