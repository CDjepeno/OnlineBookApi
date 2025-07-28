export interface JwtPayload {
  sub: number;
  id: number;
  email?: string;
  iat?: number;
  exp?: number;
}
