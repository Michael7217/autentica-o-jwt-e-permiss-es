import { Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto.js';
import { UpdateAuthDto } from './dto/update-auth.dto.js';
import { UsersService } from '../users/users.service.js';
import { Prisma } from '../generated/prisma/client.js';
import { LoginAuthDto } from './dto/login-auth.dto.js';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private readonly UsersService: UsersService, private readonly Jwtservice: JwtService){}

  async signUp(createAuthDto: CreateAuthDto) {
    return await this.UsersService.create(createAuthDto);
  }
  async signIn(loginAuthDto: LoginAuthDto) {
    const user = await this.UsersService.User({email: loginAuthDto.email}); 
    const passwordmatch = await bcrypt.compare(loginAuthDto.password, user!.password)
    if (!passwordmatch) throw new Error('Credenciais inválidas')
    const payload = {
      sub: user!.id
    }
    return {access_token: await this.Jwtservice.signAsync(payload)}
  }

  async findAll() {
    return await this.UsersService.findAll();
  }

  async findOne(params: Prisma.usersWhereUniqueInput) {  
    return await this.UsersService.User(params);
  }

  async update(params: Prisma.usersWhereUniqueInput, updateAuthDto: UpdateAuthDto) {
    return await this.UsersService.update(params, updateAuthDto);
  }

  async remove(params: Prisma.usersWhereUniqueInput) {
    return await this.UsersService.remove(params);
  }
}
