import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { USER_ROLE } from 'src/entities/role.entity';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  async canActivate(context: ExecutionContext) {
    const roles = this.reflector.get<USER_ROLE[]>(
      'roles',
      context.getHandler(),
    );

    if (!roles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();

    if (!user) {
      return false;
    }

    try {
      return roles.includes(user.role.roleName);
    } catch (e) {
      console.error(e);

      return false;
    }
  }
}
