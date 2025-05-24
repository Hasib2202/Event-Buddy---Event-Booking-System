// src/bookings/bookings.controller.ts
import { Controller, Post, Get, Body, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) { }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createBookingDto: CreateBookingDto, @Req() req) {
    return this.bookingsService.create(createBookingDto, req.user);
  }

  // @Get('me')
  // @UseGuards(JwtAuthGuard)
  // getMyBookings(@Req() req) {
  //   return this.bookingsService.findUserBookings(req.user.id);
  // }

  // src/bookings/bookings.controller.ts
  @Get('me')
  @UseGuards(JwtAuthGuard)
  getMyBookings(@Req() req) {
    // Use sub instead of id if needed
    return this.bookingsService.findUserBookings(req.user.sub || req.user.id);
  }
}