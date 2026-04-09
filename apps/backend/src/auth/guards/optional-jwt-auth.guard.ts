import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

/**
 * Populates req.user if a valid Bearer token is present.
 * Does NOT throw if the token is absent — req.user will be undefined.
 * Throws 401 if a token IS present but is invalid or expired.
 *
 * Use on public routes that optionally personalise content for authenticated
 * users (e.g. public creator profile pages).
 */
@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard('jwt') {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    return super.canActivate(context);
  }

  handleRequest<TUser>(err: unknown, user: TUser): TUser {
    // If no token was provided, return undefined instead of throwing.
    // If a token was provided but invalid, err will be set — rethrow.
    if (err) {
      throw err;
    }
    return user;
  }
}
