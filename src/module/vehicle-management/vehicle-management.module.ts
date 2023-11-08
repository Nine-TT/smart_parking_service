import { Module } from '@nestjs/common';
import { VehicleManagementController } from './vehicle-management.controller';
import { VehicleManagementService } from './vehicle-management.service';
import { VehicleManagement } from 'src/entities/vehicle_management.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([VehicleManagement])],
  controllers: [VehicleManagementController],
  providers: [VehicleManagementService],
})
export class VehicleManagementModule {}
