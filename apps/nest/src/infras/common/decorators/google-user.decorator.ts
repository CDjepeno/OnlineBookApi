import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { GoogleUserPayload } from 'src/interfaces/google-user.payload';

export const GoogleUser = createParamDecorator(
  (_: unknown, ctx: ExecutionContext): GoogleUserPayload => {
    const request = ctx.switchToHttp().getRequest();

    const user = request.user;

    if (!user || !user.email || !user.name) {
      throw new UnauthorizedException('Utilisateur Google non authentifié.');
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
    };
  },
);
