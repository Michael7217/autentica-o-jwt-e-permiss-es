import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { Prisma } from '../generated/prisma/client.js';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private readonly Prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const user = await this.Prisma.users.findUnique({
      where: {
        email: createUserDto.email,
      },
    });
    if (user) throw new ConflictException('Usuario ja cadastrado');
    const passwordhash = await bcrypt.hash(createUserDto.password, 10) //hash do password
    return await this.Prisma.users.create({
      data:{...createUserDto,
        password: passwordhash
      },select: {
        id: true, name: true, email: true, password: true}
    });
  }

  async findAll() {
    return await this.Prisma.users.findMany({
      select: {id: true, name: true, email: true}
    })
  }

  async User(where: Prisma.usersWhereUniqueInput) {
    return await this.Prisma.users.findUnique({
      where: where,
      select: {id: true, name: true, email: true, password: true}
    })
  }

  async update(params: Prisma.usersWhereUniqueInput, updateUserDto: UpdateUserDto) {
    return await this.Prisma.users.update({
      where: params,
      data: updateUserDto
  })}


  async remove(params: Prisma.usersWhereUniqueInput) {
    return await this.Prisma.users.delete({
      where: {
        email: params.email
      }
    })
  }

}