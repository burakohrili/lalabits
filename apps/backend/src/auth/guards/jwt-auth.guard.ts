import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * Requires a valid Bearer token on every decorated route.
 * Throws 401 if token is missing, expired, or invalid.
 * Throws 401 if the user account is suspended or deleted.
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
