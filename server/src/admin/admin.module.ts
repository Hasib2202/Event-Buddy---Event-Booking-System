import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { EventsModule } from 'src/events/events.module';

@Module({
  imports: [EventsModule],
  controllers: [AdminController],
})
export class AdminModule {}
