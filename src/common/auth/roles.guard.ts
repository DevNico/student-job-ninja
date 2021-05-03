import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '../enums/roles.enum';
import { AuthUser } from './auth-user.model';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    //get required role(s) from @Role decorator
    const roles = this.reflector.get<Role[]>('roles', context.getHandler());
    if (!roles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    //get user data from previous auth guard
    const user: AuthUser = request.user;
    console.log('usersroles', user.roles);
    //check if user has required role
    const hasRole = () =>
      !!user.roles.find((role) => !!roles.find((item) => item === role));

    return user && user.roles && hasRole();
  }
}
