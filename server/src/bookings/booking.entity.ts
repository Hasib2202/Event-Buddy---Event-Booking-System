// src/bookings/booking.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from 'src/users/user.entity';
import { Event } from 'src/events/event.entity';

@Entity()
export class Booking {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, user => user.bookings)
  user: User;

  @ManyToOne(() => Event, event => event.bookings)
  event: Event;

  @Column()
  numberOfSeats: number;

  @CreateDateColumn()
  bookingTime: Date;
}
