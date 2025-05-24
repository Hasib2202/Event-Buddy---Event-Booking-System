// src/events/event.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Booking } from '../bookings/booking.entity';

@Entity()
export class Event {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'date' }) // Changed to store only date
  eventDate: Date;

  @Column({ type: 'time' }) // Added for time storage
  eventTime: string;

  @Column()
  location: string;

  @Column()
  totalSeats: number;

  @Column()
  availableSeats: number;

  @Column({ nullable: true }) // Added for image URL
  eventImage: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ nullable: true })
  type: string;

  @OneToMany(() => Booking, booking => booking.event)
  bookings: Booking[];
}