// src/events/dto/create-event.dto.ts
import { IsNotEmpty, IsDateString, IsInt, Min, IsString, IsOptional, Matches } from 'class-validator';

export class CreateEventDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  description: string;

  @IsDateString()
  eventDate: Date;

  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, { message: 'Invalid time format. Use HH:MM' })
  eventTime: string;

  @IsNotEmpty()
  location: string;

  @IsString()
  @IsOptional()
  type?: string;

  @IsInt()
  @Min(1)
  totalSeats: number;

  @IsString()
  @IsOptional()
  eventImage?: string;
}