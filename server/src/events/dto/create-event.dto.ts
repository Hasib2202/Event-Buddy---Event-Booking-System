// src/events/dto/create-event.dto.ts
import { IsNotEmpty, IsDateString, IsInt, Min } from 'class-validator';

export class CreateEventDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  description: string;

  @IsDateString()
  date: Date;

  @IsNotEmpty()
  location: string;

  @IsInt()
  @Min(1)
  totalSeats: number;
}