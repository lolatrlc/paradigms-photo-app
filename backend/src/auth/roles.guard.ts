import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    //Récup rôle nécessaire pour la route
    const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!requiredRoles) return true;

    //Récup user (injecté par le JwtGuard juste avant)
    const { user } = context.switchToHttp().getRequest();
    
    //Vérif si user a bon rôle
    return requiredRoles.includes(user.role);
  }
}
