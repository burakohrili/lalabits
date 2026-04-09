/**
 * Shape attached to req.user after JwtStrategy validates a token.
 * Loaded from the database on each request to reflect current account state.
 */
export interface AuthenticatedUser {
  id: string;
  email: string;
  is_admin: boolean;
  account_status: string;
  /** Present only when token was issued by POST /admin/auth/login (OD-22). */
  scope?: 'admin';
}
