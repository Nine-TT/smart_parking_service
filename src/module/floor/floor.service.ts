import { Injectable } from '@nestjs/common';
import { Floor } from 'src/entities/floor.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { ParkingLocation } from 'src/entities/parking_location.enity';
import { FloorDTO } from 'src/dto/floor.dto';
import { paking_location_state } from 'src/constants/index';

@Injectable()
export class FloorService {
  constructor(
    @InjectRepository(Floor)
    private readonly floorRepository: Repository<Floor>,

    @InjectRepository(ParkingLocation)
    private readonly parkingLocationRepository: Repository<ParkingLocation>,
  ) {}

  async createFloor(data: FloorDTO) {
    try {
      const floor = this.floorRepository.create({
        name: data.name,
        row: data.row,
        parkingLot: data.parkingLotId,
      });

      const savedFloor = await this.floorRepository.save(floor);

      const quantityParkingLocation = data.quantity || 0;

      const parkingLocations = [];
      for (let i = 1; i <= quantityParkingLocation; i++) {
        const parkingLocation = this.parkingLocationRepository.create({
          floorId: savedFloor.id,
          parkinglot: data.parkingLotId,
          location: i,
          state: paking_location_state.empty,
          vehicleManagementId: null,
        });
        parkingLocations.push(parkingLocation);
      }

      await this.parkingLocationRepository.save(parkingLocations);

      return savedFloor;
    } catch (error) {
      console.log(error);
      throw new Error('Internal server error');
    }
  }

  async getFloorByParkingLotId(id: number) {
    try {
      const floors = await this.floorRepository.findBy({
        parkingLot: id,
      });

      return floors;
    } catch (error) {
      console.log(error);
      throw new Error('Internal server error');
    }
  }

  async updateFloorInfo(id: number, data: any) {
    try {
      const floor = await this.floorRepository.findOneBy({
        id,
      });

      if (!floor) {
        return 0;
      }

      const response = await this.floorRepository.update(id, {
        name: data.name,
      });

      return response.affected;
    } catch (error) {
      console.log(error);
      throw new Error('Internal server error');
    }
  }

  async deleteFloor(ids: number | number[]) {
    try {
      const floordIDs = Array.isArray(ids) ? ids : [ids];
      await this.parkingLocationRepository.delete({
        floorId: In(floordIDs),
      });

      const floor = await this.floorRepository.delete(floordIDs);

      return floor.affected;
    } catch (error) {
      throw new Error('Internal server error');
    }
  }
}
