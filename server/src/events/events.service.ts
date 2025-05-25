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
  ) { }

  findAll(): Promise<Event[]> {
    return this.eventRepository.find();
  }

  async findAllEventsWithBookings() {
    const events = await this.eventRepository.find({
      relations: ['bookings'],
      order: { createdAt: 'DESC' }
    });
    
    return events.map(event => ({
      ...event,
      bookedSeats: event.bookings.reduce((sum, booking) => sum + booking.seats, 0)
    }));
  }

  async findOne(id: number): Promise<Event> {
    const event = await this.eventRepository.findOne({ where: { id } });
    if (!event) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }
    return event;
  }

// src/events/events.service.ts
async create(createEventDto: CreateEventDto): Promise<Event> {
  const event = this.eventRepository.create({
    ...createEventDto,
    availableSeats: createEventDto.totalSeats
  });
  return this.eventRepository.save(event);
}

async update(id: number, updateEventDto: UpdateEventDto): Promise<Event> {
  if (Object.keys(updateEventDto).length === 0) {
    throw new BadRequestException('No update fields provided');
  }

  const event = await this.eventRepository.findOne({ where: { id } });
  if (!event) throw new NotFoundException(`Event #${id} not found`);

  // Update basic fields
  if (updateEventDto.title) event.title = updateEventDto.title;
  if (updateEventDto.description) event.description = updateEventDto.description;
  if (updateEventDto.eventDate) event.eventDate = updateEventDto.eventDate;
  if (updateEventDto.eventTime) event.eventTime = updateEventDto.eventTime;
  if (updateEventDto.location) event.location = updateEventDto.location;
  if (updateEventDto.type !== undefined) event.type = updateEventDto.type;
  if (updateEventDto.eventImage !== undefined) event.eventImage = updateEventDto.eventImage;

  // Handle seat changes
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