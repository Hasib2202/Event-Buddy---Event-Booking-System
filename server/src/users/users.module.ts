// src/users/users.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserController } from './user.controller'; // ✅ Import the controller

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UserController], // ✅ Register it here
})
export class UsersModule {}
