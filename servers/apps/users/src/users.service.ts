import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService, JwtVerifyOptions } from '@nestjs/jwt';
import { ActivationDto, LoginDto, RegisterDto } from './dto/user.dto';
import { PrismaService } from '../../../prisma/prisma.service';
import { response } from 'express';
import * as bcrypt from 'bcrypt';
import { EmailService } from './email/email.service';
import { TokenSender } from './utils/sendToken';
import { access } from 'fs';

interface UserData {
  name: string;
  email: string;
  password: string;
  phone_number: number;
}
interface LoginResponse {
  token: string;
}
@Injectable()
export class UsersService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly emailService: EmailService,
  ) {}
  // Este método é usado para registrar um novo usuário
  async register(registerDto: RegisterDto, response: Response) {
    const { name, email, password, phone_number } = registerDto;
    const isEmailExtist = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });
    const isPhoneNumberExist = await this.prisma.user.findUnique({
      where: {
        phone_number,
      },
    });

    if (isEmailExtist) {
      throw new BadRequestException('Usuário já registrado com este email.');
    }
    if (isPhoneNumberExist) {
      throw new BadRequestException(
        'Usuário já registrado com este número de telefone.',
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = {
      name,
      email,
      password: hashedPassword,
      phone_number,
    };
    const activationToken = await this.createActivationToken(user);

    const activationCode = activationToken.activationCode;

    await this.emailService.sendMail({
      email,
      subject: 'Código de ativação',
      template: './activation-mail',
      name,
      activationCode,
    });

    return { activationToken, response };
  }

  // Este método cria um token de ativação
  async createActivationToken(user: UserData) {
    const activationCode = Math.floor(1000 + Math.random() * 9000).toString();
    const token = this.jwtService.sign(
      {
        user,
        activationCode,
      },
      {
        secret: this.configService.get('ACTIVATION_SECRET'),
        expiresIn: '5m',
      },
    );
    return { token, activationCode };
  }
  // Este método é usado para ativar a conta do usuário
  async activateUser(activationDto: ActivationDto, response: Response) {
    const { activationToken, activationCode } = activationDto;
    const newUser: { user: UserData; activationCode: string } =
      this.jwtService.verify(activationToken, {
        secret: this.configService.get<string>('ACTIVATION_SECRET'),
      } as JwtVerifyOptions) as { user: UserData; activationCode: string };

    if (newUser.activationCode !== activationCode) {
      throw new BadRequestException('Código de ativação inválido.');
    }

    const { name, email, password, phone_number } = newUser.user;

    const existUser = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existUser) {
      throw new BadRequestException('Usuário já registrado com este email.');
    }

    const user = await this.prisma.user.create({
      data: {
        name,
        email,
        password,
        phone_number,
      },
    });
    return { user, response };
  }
  // Este método é usado para fazer login
  async Login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (user && (await this.comparePassword(password, user.password))) {
      const tokenSender = new TokenSender(this.configService, this.jwtService);
      return tokenSender.sendToken(user);
    } else {
      return {
        user: null,
        accessToken: null,
        refreshToken: null,
        error: { message: 'E-mail ou senha inválidos.' },
      };
    }
  }

  // Este método é usado para comparar a senha
  async comparePassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }

  // Este método é usado para retornar todos os usuários
  async getUsers() {
    return this.prisma.user.findMany();
  }
}
