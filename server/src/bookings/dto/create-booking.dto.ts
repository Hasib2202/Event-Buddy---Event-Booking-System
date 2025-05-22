// src/bookings/dto/create-booking.dto.ts
import { IsInt, Min, Max } from 'class-validator';

export class CreateBookingDto {
  @IsInt()
  eventId: number;

  @IsInt()
  @Min(1)
  @Max(4)
  seats: number;
}