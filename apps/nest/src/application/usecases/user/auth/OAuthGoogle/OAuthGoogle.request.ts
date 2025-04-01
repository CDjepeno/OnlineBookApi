export interface RequestWithUser extends Request {
    user: {
      googleId: string;
      email: string;
      name: string;
      accessToken: string;
    };
  }