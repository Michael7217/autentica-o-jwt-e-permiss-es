import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service.js';
import { ConfigModule } from '@nestjs/config';

@Global()
@Module({
    imports: [ConfigModule],
    controllers: [],
    providers: [PrismaService],
    exports: [PrismaService]
})
export class PrismaModule {}
