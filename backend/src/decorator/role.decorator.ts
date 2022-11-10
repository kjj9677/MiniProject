import { SetMetadata } from '@nestjs/common';
import { USER_ROLE } from 'src/entities/role.entity';

export const Roles = (...roles: USER_ROLE[]) => SetMetadata('roles', roles);
