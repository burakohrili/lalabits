import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { AuthenticatedUser } from '../interfaces/authenticated-user.interface';

/**
 * Enforces admin-scoped token access (OD-22).
 *
 * Must be used AFTER JwtAuthGuard in the guard chain so that req.user is
 * already populated. Rejects with 403 if:
 *   - req.user is absent (no prior auth guard — misuse)
 *   - token scope !== 'admin' (fan-issued tokens must not access admin routes)
 *
 * Checking scope (not just is_admin) ensures that only tokens explicitly
 * issued by POST /admin/auth/login are accepted on admin routes.
 */
@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<{ user?: AuthenticatedUser }>();
    const user = request.user;

    if (!user || user.scope !== 'admin') {
      throw new ForbiddenException('NOT_ADMIN');
    }

    return true;
  }
}
