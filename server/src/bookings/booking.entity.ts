// src/bookings/booking.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, JoinColumn } from 'typeorm';
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
  @JoinColumn({ name: 'userId' }) // Explicitly define the column name
  user: User;

  @ManyToOne(() => Event, event => event.bookings)
  event: Event;
}