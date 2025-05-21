// src/events/event.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Booking } from '../bookings/booking.entity';

@Entity()
export class Event {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column()
  date: Date;

  @Column()
  time: string;

  @Column()
  location: string;

  @Column()
  totalSeats: number;

  @Column()
  availableSeats: number;

  @Column({ nullable: true })
  image: string;

  @OneToMany(() => Booking, booking => booking.event)
  bookings: Booking[];
}
