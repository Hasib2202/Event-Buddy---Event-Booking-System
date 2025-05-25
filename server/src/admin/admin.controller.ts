// src/admin/admin.controller.ts
import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { EventsService } from 'src/events/events.service';
import { UserRole } from 'src/users/user.entity';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdminController {

  constructor(private readonly eventService: EventsService) {}

  @Get('dashboard')
  @Roles(UserRole.ADMIN)
  getAdminDashboard() {
    return { message: 'Welcome to Admin Dashboard' };
  }

  @Get('events')
  @Roles(UserRole.ADMIN)
  async getEvents() {
    return this.eventService.findAllEventsWithBookings();
  }

  
}
