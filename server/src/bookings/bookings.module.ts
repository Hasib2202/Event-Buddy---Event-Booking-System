// src/bookings/bookings.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingsController } from './bookings.controller';
import { BookingsService } from './bookings.service';
import { Booking } from './booking.entity';
import { Event } from '../events/event.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Booking, Event])
  ],
  controllers: [BookingsController],
  providers: [BookingsService]
})
export class BookingsModule {}