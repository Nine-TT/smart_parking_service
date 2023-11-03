import { Module } from '@nestjs/common';
import { ParkingLocationService } from './parking-location.service';
import { ParkingLocationController } from './parking-location.controller';
import { ParkingLocation } from 'src/entities/parking_location.enity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VehicleManagement } from 'src/entities/vehicle_management.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ParkingLocation, VehicleManagement])],
  providers: [ParkingLocationService],
  controllers: [ParkingLocationController],
})
export class ParkingLocationModule {}
