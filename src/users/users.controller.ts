import { Controller, Post, Body, NotFoundException, Put, Param, ParseIntPipe } from '@nestjs/common';
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

  @Put(':id/reset-password')
  async resetPasswordDirect(@Param('id', ParseIntPipe) id: number, @Body() data: any) {
      if (!data.newPassword) throw new NotFoundException('newPassword is required');
      return this.usersService.resetPasswordDirect(id, data.newPassword);
  }
}
