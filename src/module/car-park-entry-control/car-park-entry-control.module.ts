import { Module } from '@nestjs/common';
import { CarParkEntryControlController } from './car-park-entry-control.controller';
import { CarParkEntryControlService } from './car-park-entry-control.service';
import { VehicleManagement } from 'src/entities/vehicle_management.entity';
import { Card } from 'src/entities/card.entity';
import { Reevenue } from 'src/entities/revenue.entity';
import { MonthlyTicket } from 'src/entities/monthly_ticket.entity';
import { Price } from 'src/entities/price.enitty';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UploadFile } from 'src/util/upload-file';
import { ParkingLocation } from 'src/entities/parking_location.enity';
import { Floor } from 'src/entities/floor.entity';
import { MyGateway } from '../websocket/event.gateway';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      VehicleManagement,
      Card,
      Reevenue,
      MonthlyTicket,
      Price,
      ParkingLocation,
      Floor,
    ]),
  ],
  controllers: [CarParkEntryControlController],
  providers: [CarParkEntryControlService, UploadFile, MyGateway],
})
export class CarParkEntryControlModule {}
