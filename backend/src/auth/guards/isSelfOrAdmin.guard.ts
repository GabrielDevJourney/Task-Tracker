// is-self-or-admin.guard.ts
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from 'src/common/roles.enum';

interface RequestUser {
  userId: string;
  roles: Role[];
}
interface RequestWithUser extends RequestUser {
  user: RequestUser;
  params: {
    id: string;
  };
}
@Injectable()
export class IsSelfOrAdminGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const { user } = request;
    const userId = request.params.id;

    const isAdmin = user.roles?.includes(Role.ADMIN);

    const isSelf = userId === user.userId;

    if (isAdmin || isSelf) {
      return true;
    }

    throw new ForbiddenException('Forbidden');
  }
}
