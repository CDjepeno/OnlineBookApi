import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import {
  Profile,
  Strategy,
  StrategyOptions,
  VerifyCallback,
} from 'passport-google-oauth20';
import { LoginGoogleRequest } from 'src/domaine/user/usecases/google/login.google.request';
import { UserRepositoryTypeorm } from 'src/infras/services/user.repository.typeorm';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    readonly configService: ConfigService,
    private readonly userRepository: UserRepositoryTypeorm,
  ) {
    super({
      clientID: configService.get<string>('GOOGLE_CLIENT_ID') ?? '',
      clientSecret: configService.get<string>('GOOGLE_CLIENT_SECRET') ?? '',
      callbackURL: configService.get<string>('GOOGLE_REDIRECT_URI') ?? '',
      scope: ['email', 'profile'],
    } as StrategyOptions);
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ) {
    const { displayName, emails } = profile;

    if (!emails || emails.length === 0) {
      return done(new Error('Email not found in Google profile'), false);
    }

    const email = emails[0].value;
    const name = displayName;

    let user = await this.userRepository
      .findGoogleUserAndGenerateToken(email)
      .catch(() => null);

    if (!user) {
      const newUser: LoginGoogleRequest = {
        email,
        name,
      };
      user = await this.userRepository.signUpByGoogleAuth(newUser);
    }

    done(null, user);
  }
}
