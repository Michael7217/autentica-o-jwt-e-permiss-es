import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class UsersService {
  constructor(private readonly Prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const user = await this.Prisma.users.findUnique({
      where: {
        email: createUserDto.email,
      },
    });
    if (!user) throw new ConflictException('Usuario ja cadastrado');
    return await this.Prisma.users.create({
      data: createUserDto,
    });
  }

  async findAll() {
    return await this.Prisma.users.findMany({
      select: {id: true, name: true, email: true}
    })
  }

  async update(updateUserDto: UpdateUserDto) {
    return await this.Prisma.users.update({
      where: {
        email: updateUserDto.email
      },
      data: updateUserDto
  })}


  async remove(email: string) {
    return await this.Prisma.users.delete({
      where: {
        email: email
      }
    })
  }

}