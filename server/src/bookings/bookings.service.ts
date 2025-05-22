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
  ) {}

  async create(createBookingDto: CreateBookingDto, user: any): Promise<Booking> {
    // Debug: Log user object
    console.log('User object from JWT:', JSON.stringify(user, null, 2));
    
    const event = await this.eventRepository.findOne({
      where: { id: createBookingDto.eventId }
    });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    if (event.date < new Date()) {
      throw new BadRequestException('Cannot book past events');
    }

    if (createBookingDto.seats < 1 || createBookingDto.seats > 4) {
      throw new BadRequestException('Can only book 1-4 seats');
    }

    if (event.availableSeats < createBookingDto.seats) {
      throw new BadRequestException('Not enough available seats');
    }

    // Extract user ID
    const userId = user.id || user.sub || user.userId;
    
    if (!userId) {
      throw new BadRequestException('User ID not found in JWT token');
    }

    console.log('Extracted userId:', userId);

    // Use transaction to ensure data consistency
    return await this.dataSource.transaction(async manager => {
      // Update available seats
      await manager.update(Event, event.id, {
        availableSeats: event.availableSeats - createBookingDto.seats
      });

      // Insert booking using raw SQL
      const result = await manager.query(
        `INSERT INTO booking (seats, "userId", "eventId") VALUES ($1, $2, $3) RETURNING id, "bookingDate"`,
        [createBookingDto.seats, userId, event.id]
      );

      const bookingId = result[0].id;

      // Fetch and return the created booking
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

  findUserBookings(userId: number): Promise<Booking[]> {
    return this.bookingRepository.find({
      where: { user: { id: userId } },
      relations: ['event', 'user']
    });
  }
}