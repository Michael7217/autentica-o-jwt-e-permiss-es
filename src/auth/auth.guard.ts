import { CanActivate, ExecutionContext, Injectable, Req, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService){}
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest()
    const authorization = request.headers.authorization;
    const [type, token] = authorization?.split(' ') ?? [];

    if (type !== 'Bearer' || !token) throw new UnauthorizedException('Token inválido')
    
    try{
      
      const payload = this.jwtService.verify(token, {
        secret: process.env.SECRET_KEY
      })
      request.user = payload;
      return true;
    }catch(error){
      throw new Error('Token inválido')
    }
  }
}
