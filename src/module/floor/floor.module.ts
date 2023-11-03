import { Module } from '@nestjs/common';
import { FloorController } from './floor.controller';
import { FloorService } from './floor.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Floor } from 'src/entities/floor.entity';
import { ParkingLocation } from 'src/entities/parking_location.enity';

@Module({
  imports: [TypeOrmModule.forFeature([Floor, ParkingLocation])],
  controllers: [FloorController],
  providers: [FloorService],
})
export class FloorModule {}
