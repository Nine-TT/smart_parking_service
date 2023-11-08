import { Injectable } from '@nestjs/common';
import { VehicleManagement } from 'src/entities/vehicle_management.entity';
import { getRepository, Repository, SelectQueryBuilder, Equal } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { vehicle_type } from 'src/constants';

@Injectable()
export class VehicleManagementService {
  constructor(
    @InjectRepository(VehicleManagement)
    private readonly vehicleRepository: Repository<VehicleManagement>,
  ) {}

  async getVehicleManagementWithCount(
    page: number,
    pageSize: number,
    state: string,
    parkingLotId?: number,
    floorId?: number,
  ) {
    try {
      const skip = (page - 1) * pageSize;

      if (parkingLotId && floorId === undefined) {
        const [vehicle, count] = await this.vehicleRepository.findAndCount({
          where: {
            state: Equal(state),
            parkingLotId: parkingLotId,
          },
          relations: ['floor', 'parkingLocation', 'parkingLot', 'card'],
          skip,
          take: pageSize,
        });

        const vehicleManagement = {
          vehicles: vehicle,
          count: count,
        };
        return vehicleManagement;
      } else if (parkingLotId && floorId) {
        const skip = (page - 1) * pageSize;

        const [vehicle, count] = await this.vehicleRepository.findAndCount({
          where: {
            state: Equal(state),
            parkingLotId: parkingLotId,
            floorId: floorId,
          },
          relations: ['floor', 'parkingLocation', 'parkingLot', 'card'],
          skip,
          take: pageSize,
        });

        const vehicleManagement = {
          vehicles: vehicle,
          count: count,
        };

        return vehicleManagement;
      }

      const [vehicle, count] = await this.vehicleRepository.findAndCount({
        where: {
          state: Equal(state),
        },
        relations: ['floor', 'parkingLocation', 'parkingLot', 'card'],
        skip,
        take: pageSize,
      });

      const vehicleManagement = {
        vehicles: vehicle,
        count: count,
      };
      return vehicleManagement;
    } catch (error) {
      console.log(error);
      throw new Error('Internal server error');
    }
  }

  async findCarsWithBS(bs: string) {
    try {
      const cars = await this.vehicleRepository
        .createQueryBuilder('vehicleManagement')
        .leftJoinAndSelect('vehicleManagement.floor', 'floor')
        .leftJoinAndSelect(
          'vehicleManagement.parkingLocation',
          'parkingLocation',
        )
        .leftJoinAndSelect('vehicleManagement.parkingLot', 'parkingLot')
        .where('vehicleManagement.licensePlates = :valueA', { valueA: bs })
        .andWhere('vehicleManagement.state = :valueB', {
          valueB: vehicle_type.parked,
        })
        .getMany();

      return cars;
    } catch (error) {
      throw new Error('Internal server error');
    }
  }
}
