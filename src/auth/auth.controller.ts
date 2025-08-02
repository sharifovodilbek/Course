import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { Role } from '@prisma/client';
import { ApiQuery } from '@nestjs/swagger';
import { LoginAuthDto } from './dto/login-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'role', required: false, type: String })
  @ApiQuery({ name: 'filter', required: false, type: String })
  @Get()
  findAll(
    @Query('role') role: Role,
    @Query('filter') filter: string,
    @Query('page') page: number,
    @Query('limit') limit: number,
  ) {
    return this.authService.findAll(role, filter, +page, +limit);
  }

  @Post('register')
  async register(@Body() data: CreateAuthDto) {
    return await this.authService.register(data);
  }

  @Post('login')
  async login(@Body() data: LoginAuthDto) {
    return await this.authService.login(data);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: UpdateAuthDto) {
    return this.authService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authService.remove(id);
  }

}