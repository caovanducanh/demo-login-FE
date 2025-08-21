// Định nghĩa type cho JWT payload
export interface JwtPayload {
  sub: string;
  roles: string[];
  fullName?: string;
  refreshExp?: number;
  tokenVersion?: number;
  jti?: string;
  iat?: number;
  exp?: number;
}
