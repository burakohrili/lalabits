/** Payload embedded in short-lived access tokens. */
export interface JwtPayload {
  /** User UUID — standard JWT subject claim */
  sub: string;
  email: string;
  is_admin: boolean;
  /**
   * Present only in tokens issued by POST /admin/auth/login.
   * Fan-issued tokens must NOT carry this claim.
   * AdminGuard requires scope === 'admin' (OD-22).
   */
  scope?: 'admin';
}

/** Payload embedded in long-lived refresh tokens. */
export interface JwtRefreshPayload {
  sub: string;
  /** UUID linking this refresh token to a Redis revocation entry. */
  tokenId: string;
  type: 'refresh';
}
