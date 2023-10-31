import { Module } from '@nestjs/common';
import { ParkingLotController } from './parkingLot.controller';
import { ParkingLotService } from './parkingLot.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ParkingLot } from 'src/entities/parking_lot.enity';
import { MyGateway } from '../websocket/event.gateway';

@Module({
  imports: [TypeOrmModule.forFeature([ParkingLot])],
  providers: [ParkingLotService, MyGateway],
  controllers: [ParkingLotController],
})
export class ParkingLotModule {}
