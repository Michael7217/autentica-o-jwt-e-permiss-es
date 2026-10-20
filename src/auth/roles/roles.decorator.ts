import { role } from '../../generated/prisma/enums.js';
import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles'
export const Roles = (...roles: role[]) => (
    SetMetadata(ROLES_KEY, roles)
);