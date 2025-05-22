// src/bookings/booking.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from '../users/user.entity';
import { Event } from '../events/event.entity';

@Entity()
export class Booking {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  seats: number;

  @CreateDateColumn()
  bookingDate: Date;

  @ManyToOne(() => User, user => user.bookings)
  user: User;

  @ManyToOne(() => Event, event => event.bookings)
  event: Event;
}