import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { role } from '../generated/prisma/enums.js';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles/roles.decorator.js';

type AuthenticatedRequest = {
  user?: {
    role?: role
  }
};

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly Reflector: Reflector){}
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const requiredRoles = this.Reflector.getAllAndOverride<role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles.length){
      return true;
    }

    const request = context.switchToHttp().getRequest()
    const userRole = request.user?.role;

    if(!userRole || !requiredRoles.includes(userRole)){
      throw new ForbiddenException('sem permissão para acessar')
    }
    return true;
  }
}
