import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<string[]>(
      'role',
      context.getHandler(),
    );

    if (!requiredRoles || requiredRoles.length === 0) {
      return true; // Nếu không có yêu cầu vai trò, cho phép truy cập.
    }

    const request = context.switchToHttp().getRequest();
    const payload = request.user; // Giả sử user đã được gán bởi AuthGuard.

    console.log(request);

    if (!payload || !payload.role) {
      throw new UnauthorizedException('Invalid user or role');
    }

    // Kiểm tra xem vai trò trong payload có nằm trong danh sách các vai trò yêu cầu.
    const hasRequiredRole = requiredRoles.includes(payload.role);

    if (!hasRequiredRole) {
      throw new UnauthorizedException('Insufficient role');
    }

    return true;
  }
}
