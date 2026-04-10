import { Controller, Post, Body, NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('confirm')
  async confirm(@Body('confirmationToken') confirmationToken: string) {
    if (!confirmationToken) {
      throw new NotFoundException('Token manquant.');
    }
    return this.usersService.confirmAccount(confirmationToken);
  }
}
