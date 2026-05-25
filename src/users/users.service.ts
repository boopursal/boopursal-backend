import { Injectable, NotFoundException, Inject, forwardRef } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
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

  async resetPasswordDirect(id: number, newPasswordStr: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('Utilisateur introuvable');
    
    // Default salt rounds is usually 10
    const hashedPassword = await bcrypt.hash(newPasswordStr, 10);
    
    await this.prisma.user.update({
      where: { id },
      data: { password: hashedPassword }
    });

    return { success: true, message: 'Mot de passe réinitialisé' };
  }
}
