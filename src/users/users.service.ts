import { Injectable, NotFoundException, Inject, forwardRef } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    @Inject(forwardRef(() => AuthService))
    private authService: AuthService,
  ) {}

  async confirmAccount(token: string) {
    const user = await this.prisma.user.findFirst({
      where: { confirmation_token: token },
      include: {
        acheteur: true,
        fournisseur: true,
        avatar: true,
      },
    });

    if (!user) {
      throw new NotFoundException('Jeton de confirmation invalide.');
    }

    // Activer l'utilisateur
    const updatedUser = await this.prisma.user.update({
      where: { id: user.id },
      data: {
        isactif: true,
        confirmation_token: null,
      },
      include: {
        acheteur: true,
        fournisseur: true,
        avatar: true,
      },
    });

    // Générer le token de connexion automatique (comme dans login)
    let roles = [];
    try {
      if (updatedUser.roles) {
        const rawRoles = updatedUser.roles.trim();
        if (rawRoles.startsWith('[') || rawRoles.startsWith('{')) {
          roles = JSON.parse(rawRoles);
        } else {
          roles = [rawRoles];
        }
      }
    } catch (e) {
      roles = ['ROLE_USER'];
    }

    const loginData = await this.authService.loginWithUser(updatedUser, roles);
    return loginData;
  }
}
