// src/events/events.service.ts
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';
import { Event } from './event.entity';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
  ) {}

  findAll(): Promise<Event[]> {
    return this.eventRepository.find();
  }

  async findOne(id: number): Promise<Event> {
    const event = await this.eventRepository.findOne({ where: { id } });
    if (!event) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }
    return event;
  }

  async create(createEventDto: CreateEventDto): Promise<Event> {
    const event = this.eventRepository.create({
      ...createEventDto,
      availableSeats: createEventDto.totalSeats
    });
    return this.eventRepository.save(event);
  }

  // src/events/events.service.ts
async update(id: number, updateEventDto: UpdateEventDto): Promise<Event> {
  // Check if update payload is empty
  if (Object.keys(updateEventDto).length === 0) {
    throw new BadRequestException('No update fields provided');
  }

  const event = await this.findOne(id);
  
  // Validate and update fields
  if (updateEventDto.title) event.title = updateEventDto.title;
  if (updateEventDto.description) event.description = updateEventDto.description;
  if (updateEventDto.date) event.date = updateEventDto.date;
  if (updateEventDto.location) event.location = updateEventDto.location;
  
  // Handle seats updates
  if (updateEventDto.totalSeats !== undefined) {
    const diff = updateEventDto.totalSeats - event.totalSeats;
    event.totalSeats = updateEventDto.totalSeats;
    event.availableSeats += diff;
  }

  return this.eventRepository.save(event);
}

  async remove(id: number): Promise<void> {
    await this.eventRepository.delete(id);
  }
}