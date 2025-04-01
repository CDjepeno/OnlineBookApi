import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy, VerifyCallback } from 'passport-google-oauth20';
import { RequestWithUser } from 'src/application/usecases/user/auth/OAuthGoogle/OAuthGoogle.request';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    const clientID = configService.get<string>('GOOGLE_CLIENT_ID');
    const clientSecret = configService.get<string>('GOOGLE_SECRET');
    const callbackURL = configService.get<string>('GOOGLE_REDIRECT_URI');
  
    if (!clientID || !clientSecret || !callbackURL) {
      throw new Error('Missing Google OAuth environment variables');
    }
    super({
        clientID,
        clientSecret,
        callbackURL,
        scope: ['email', 'profile'],
        passReqToCallback: true,
      });
  }

  async validate(
    _request:RequestWithUser,
    accessToken: string,
    _refresToken: string,
    profile: Profile,
    done: VerifyCallback,
  ): Promise<void> {
    
    const { sub, given_name, email } = profile._json;
    const user = {
      googleId: sub,
      email: email,
      name: given_name,
      accessToken,
    };
    done(null, user);
  }
}
