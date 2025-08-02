import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { LoginAuthDto } from './dto/login-user.dto';


@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,

  ) { }

  async findAll(
    role: Role,
    filter: string,
    page: number,
    limit: number,
  ) {
    let take = limit || 10;
    let skip = page ? (page - 1) * take : 0;
    let where: any = {};
    if (role) {
      where.role = role;
    }
    if (filter) {
      where.name = {
        startsWith: filter,
      };
    }
    let users = await this.prisma.user.findMany({
      where,
      skip,
      take,
    });
    return users;
  }


  async register(data: CreateAuthDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: data.email }
    });

    if (existingUser) {
      throw new BadRequestException('Bu email bilan foydalanuvchi mavjud')
    }

    const hashedPassword = bcrypt.hashSync(data.password, 10);

    const newUser = await this.prisma.user.create({
      data: {
        name: data.name,
        password: hashedPassword,
        email: data.email,
        role: data.role,
      }
    })

    return {
      message: 'Foydalanuvchi muvaffaqiyatli ro\'yxatdan o\'tdi',
      user: newUser,
    };
  }

  async login(data: LoginAuthDto) {
    const { email, password } = data;
    let user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new NotFoundException('user not found');

    let match = bcrypt.compareSync(password, user.password);
    if (!match) throw new NotFoundException('wrong password');

    let token = this.jwt.sign({ id: user.id, role: user.role, email: user.email });
    return { token };
  }

  async update(id: string, data: UpdateAuthDto) {
    try {
      const existing = await this.prisma.user.findUnique({ where: { id } });
      if (!existing) {
        throw new NotFoundException('Yangilamoqchi bo\'lgan user topilmadi');
      }

      if (data.password) {
        const salt = await bcrypt.genSalt(10);
        data.password = await bcrypt.hash(data.password, salt);
      }

      return await this.prisma.user.update({ where: { id }, data });
    } catch (error) {
      throw new BadRequestException('Yangilashda xatolik: ' + error.message);
    }
  }


  async remove(id: string) {
    let user = await this.prisma.user.findUnique({
      where: { id },
    });
    if (!user) throw new NotFoundException('user not found');
    let deleted = await this.prisma.user.delete({ where: { id } });
    return deleted;
  }

}
