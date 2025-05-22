// src/users/user.controller.ts
import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'src/users/user.entity';

@Controller('user')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UserController {
  @Get('dashboard')
  @Roles(UserRole.USER)
  getUserDashboard() {
    return { message: 'Welcome to User Dashboard' };
  }
}
