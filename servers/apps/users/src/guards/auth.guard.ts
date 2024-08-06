import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../../../prisma/prisma.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const gqlContext = GqlExecutionContext.create(context);
    const { req } = gqlContext.getContext();

    const accessToken = req.headers.accesstoken as string;
    const refreshToken = req.headers.refreshtoken as string;

    if (!accessToken || !refreshToken) {
      throw new UnauthorizedException(
        'Por favor faça login para utilizar este recurso!',
      );
    }

    try {
      const decodedAccessToken = this.jwtService.verify(accessToken, {
        secret: this.config.get<string>('ACCESS_TOKEN_SECRET'),
      });

      const user = await this.prisma.user.findUnique({
        where: { id: decodedAccessToken.id },
      });

      if (!user) {
        throw new UnauthorizedException('Usuário não encontrado');
      }

      // Define as informações no contexto da requisição
      req.user = user;
      req.accessToken = accessToken;
      req.refreshToken = refreshToken;

      return true;
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        // Se o accessToken expirou, tenta atualizar com o refreshToken
        return this.updateAccessToken(req);
      }
      throw new UnauthorizedException('Token inválido');
    }
  }

  private async updateAccessToken(req: any): Promise<boolean> {
    try {
      const decoded = this.jwtService.verify(req.headers.refreshtoken, {
        secret: this.config.get<string>('REFRESH_TOKEN_SECRET'),
      });

      const user = await this.prisma.user.findUnique({
        where: { id: decoded.id },
      });

      if (!user) {
        throw new UnauthorizedException('Usuário não encontrado');
      }

      const newAccessToken = this.jwtService.sign(
        { id: user.id },
        {
          secret: this.config.get<string>('ACCESS_TOKEN_SECRET'),
          expiresIn: '5m',
        },
      );

      // Atualiza as informações no contexto da requisição
      req.user = user;
      req.accessToken = newAccessToken;
      req.refreshToken = req.headers.refreshtoken;

      return true;
    } catch (error) {
      throw new UnauthorizedException('Por favor faça login novamente');
    }
  }
}
