import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { LoginDto, RegisterDto } from './dto/user.dto';
import { PrismaService } from '../../../prisma/prisma.service';
import { response } from 'express';

@Injectable()
export class UsersService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}
  // Este método é usado para registrar um novo usuário
  async register(registerDto: RegisterDto, response: Response) {
    const { name, email, password } = registerDto;
    const isEmailExtist = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (isEmailExtist) {
      throw new BadRequestException('Usuário já registrado com este email.');
    }
    const user = await this.prisma.user.create({
      data: {
        name,
        email,
        password,
      },
    });
    return { user, response };
  }

  // Este método é usado para fazer login
  async Login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const user = { email, password };

    return user;
  }

  // Este método é usado para retornar todos os usuários
  async getUsers() {
    return this.prisma.user.findMany();
  }
}
