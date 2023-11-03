import { Injectable } from '@nestjs/common';
import { ParkingLocation } from 'src/entities/parking_location.enity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VehicleManagement } from 'src/entities/vehicle_management.entity';
import { paking_location_state } from 'src/constants/index';

@Injectable()
export class ParkingLocationService {
  constructor(
    @InjectRepository(ParkingLocation)
    private readonly parkingLocationRepository: Repository<ParkingLocation>,

    @InjectRepository(VehicleManagement)
    private readonly vehicleManagementRepository: Repository<VehicleManagement>,
  ) {}

  async changeParkingLocationState(
    listIdBlocked?: number[],
    listRoad?: number[],
    listEmpty?: number[],
    floorId?: number,
  ) {
    try {
      const parkingLocations = await this.parkingLocationRepository.find({
        where: {
          floorId,
        },
        order: {
          id: 'ASC',
        },
      });

      if (parkingLocations.length === 0) {
        return;
      }

      let x = 1;
      for (let i = 0; i < parkingLocations.length; i++) {
        if (listEmpty.includes(parkingLocations[i].id)) {
          parkingLocations[i].state = paking_location_state.empty;
          parkingLocations[i].location = x;
          x++;
        } else if (listIdBlocked.includes(parkingLocations[i].id)) {
          parkingLocations[i].state = paking_location_state.blocked;
        } else if (listRoad.includes(parkingLocations[i].id)) {
          parkingLocations[i].state = paking_location_state.road;
        } else if (listEmpty.includes(parkingLocations[i].id)) {
        } else if (
          parkingLocations[i].state === paking_location_state.blocked ||
          parkingLocations[i].state === paking_location_state.road
        ) {
          continue;
        } else if (parkingLocations[i].state === paking_location_state.empty) {
          parkingLocations[i].location = x;
          x++;
        }
      }

      // Lưu trữ các thay đổi vị trí vào cơ sở dữ liệu
      await this.parkingLocationRepository.save(parkingLocations);
      return 1;
    } catch (error) {
      console.log(error);
      throw new Error('Internal server error');
    }
  }

  async getParkingLocationInfo(id: number) {
    try {
      const response = await this.parkingLocationRepository.findOneBy({
        id,
      });

      if (response && response.state === paking_location_state.empty) {
        return response;
      } else if (
        response &&
        response.state === paking_location_state.has_vehicle
      ) {
        let responseDataVehicle = this.vehicleManagementRepository.findOneBy({
          id: response.vehicleManagementId,
        });

        return responseDataVehicle;
      }

      return 0;
    } catch (error) {
      throw new Error('Internal server error');
    }
  }

  async getAllParkingLocationByFloorId(floorId: number) {
    try {
      const parkingLocations = await this.parkingLocationRepository.findBy({
        floorId: floorId,
      });

      return parkingLocations;
    } catch (error) {
      throw new Error('Internal server error');
    }
  }
}
