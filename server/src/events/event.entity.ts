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

  @Column({ type: 'timestamptz' })
  date: Date;

  @Column()
  location: string;

  @Column()
  totalSeats: number;

  @Column()
  availableSeats: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Booking, booking => booking.event)
  bookings: Booking[];
}