import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';

export const UserEmail = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    console.log('ctx : ', request);
    const user = request.user;
    if (!user || !user.email) {
      throw new UnauthorizedException('Email introuvable dans le token');
    }
    return user.email;
  },
);
