// src/bookings/bookings.service.ts
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Booking } from './booking.entity';
import { Event } from '../events/event.entity';
import { User } from '../users/user.entity';
import { CreateBookingDto } from './dto/create-booking.dto';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private bookingRepository: Repository<Booking>,
    @InjectRepository(Event)
    private eventRepository: Repository<Event>,
    private dataSource: DataSource
  ) { }

  async create(createBookingDto: CreateBookingDto, user: any): Promise<Booking> {
    const event = await this.eventRepository.findOne({
      where: { id: createBookingDto.eventId }
    });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    // Combine date and time to check if event is in the past
    const eventDateTime = new Date(event.eventDate);
    const [hours, minutes] = event.eventTime.split(':').map(Number);
    eventDateTime.setHours(hours, minutes, 0, 0);

    if (eventDateTime < new Date()) {
      throw new BadRequestException('Cannot book past events');
    }

    if (createBookingDto.seats < 1 || createBookingDto.seats > 4) {
      throw new BadRequestException('Can only book 1-4 seats');
    }

    if (event.availableSeats < createBookingDto.seats) {
      throw new BadRequestException('Not enough available seats');
    }

    const userId = user.id || user.sub || user.userId;
    if (!userId) {
      throw new BadRequestException('User ID not found in JWT token');
    }

    return await this.dataSource.transaction(async manager => {
      await manager.update(Event, event.id, {
        availableSeats: event.availableSeats - createBookingDto.seats
      });

      const result = await manager.query(
        `INSERT INTO booking (seats, "userId", "eventId") VALUES ($1, $2, $3) RETURNING id, "bookingDate"`,
        [createBookingDto.seats, userId, event.id]
      );

      const bookingId = result[0].id;

      const booking = await manager.findOne(Booking, {
        where: { id: bookingId },
        relations: ['user', 'event']
      });

      if (!booking) {
        throw new NotFoundException('Created booking not found');
      }

      return booking;
    });
  }

  // findUserBookings(userId: number): Promise<Booking[]> {
  //   return this.bookingRepository.find({
  //     where: { user: { id: userId } },
  //     relations: ['event', 'user'],
  //     order: { bookingDate: 'DESC' }
  //   });
  // }
  // src/bookings/bookings.service.ts
  findUserBookings(userId: number): Promise<Booking[]> {
    return this.bookingRepository.find({
      where: {
        user: { id: userId } // Make sure this matches your entity relation
      },
      relations: ['event', 'user'],
      order: { bookingDate: 'DESC' }
    });
  }
}