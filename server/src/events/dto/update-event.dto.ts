// src/events/dto/update-event.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateEventDto } from './create-event.dto';
import { IsInt, Min, IsOptional } from 'class-validator';

export class UpdateEventDto extends PartialType(CreateEventDto) {
  @IsOptional()
  @IsInt()
  @Min(0)
  availableSeats?: number;
}