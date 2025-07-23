import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { JwtPayload } from 'src/interfaces/jwtPayload.interface';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    @Inject(JwtService) private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('Token authentification manquant');
    }
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>('JWT_SECRET'),
        ignoreExpiration: false,
        clockTolerance: 30,
      });

      if (!payload || (!payload.id && !payload.sub)) {
        throw new UnauthorizedException(
          'Token invalide: identifiant utilisateur manquant',
        );
      }

      const normalizedPayload: JwtPayload = {
        ...payload,
        id: payload.id || payload.sub,
        sub: payload.sub || payload.id,
      };

      request.user = normalizedPayload;
    } catch (error: unknown) {
      return this.handleJwtError(error);
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      return undefined;
    }

    const [type, token] = authHeader.split(' ');

    if (type !== 'Bearer' || !token) {
      return undefined;
    }

    return token;
  }

  private handleJwtError(error: unknown): never {
    // Si c'est déjà une UnauthorizedException, on la relance
    if (error instanceof UnauthorizedException) {
      throw error;
    }

    // Gestion des erreurs JWT spécifiques
    if (error instanceof Error) {
      switch (error.name) {
        case 'TokenExpiredError':
          throw new UnauthorizedException('Token expiré');
        case 'JsonWebTokenError':
          throw new UnauthorizedException('Token malformé');
        case 'NotBeforeError':
          throw new UnauthorizedException('Token pas encore valide');
        default:
          // Log pour debugging (sans exposer le token)
          console.error('JWT verification failed:', error.message);
          throw new UnauthorizedException('Token invalide');
      }
    }

    // Erreur inconnue
    throw new UnauthorizedException("Erreur d'authentification");
  }
}
