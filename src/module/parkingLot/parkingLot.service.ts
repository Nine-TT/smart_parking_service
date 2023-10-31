import { Injectable } from '@nestjs/common';
import { ParkingLot } from 'src/entities/parking_lot.enity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ParkingLotDto } from 'src/dto/parkingLot.dto';
import { MyGateway } from '../websocket/event.gateway';

@Injectable()
export class ParkingLotService {
  constructor(
    @InjectRepository(ParkingLot)
    private readonly parkingLotRepository: Repository<ParkingLot>,
    private readonly soketService: MyGateway,
  ) {}

  async createParkingLot(data: ParkingLotDto): Promise<any> {
    try {
      const parkingLot = await this.parkingLotRepository.save(data);
      this.soketService.server.emit(
        'onParkingLotCreated',
        'Create parking lot successfully',
      );
      return parkingLot;
    } catch (error) {
      console.log(error);
      throw new Error('Internal server error');
    }
  }

  async updateParkingLot(
    responseData: ParkingLotDto,
    id: number,
  ): Promise<number> {
    try {
      const parkingLot = await this.parkingLotRepository.findOneBy({
        id,
      });

      if (!parkingLot) {
        return 0;
      }

      const response = await this.parkingLotRepository.update(id, {
        name: responseData.name,
        address: responseData.address,
      });

      return response.affected;
    } catch (error) {
      console.log(error);
      throw new Error('Internal server error');
    }
  }

  async getAllParkingLot({ page, pageSize }) {
    try {
      const skip = (page - 1) * pageSize;

      const [parkingLots, count] = await this.parkingLotRepository.findAndCount(
        {
          skip,
          take: pageSize,
        },
      );

      const dataParkingLot = {
        parkingLots: parkingLots,
        count: count,
      };

      return dataParkingLot;
    } catch (error) {
      throw new Error('Internal server error');
    }
  }

  async getParkingLotById(id: number) {
    try {
      const parkingLot = await this.parkingLotRepository.findOneBy({
        id,
      });
      if (parkingLot) {
        return parkingLot;
      } else {
        return 0;
      }
    } catch (error) {
      console.log(error);
      throw new Error('Internal server error');
    }
  }

  async deleteParkingLotByID(ids: number | number[]): Promise<number> {
    try {
      const parkingLotIds = Array.isArray(ids) ? ids : [ids];

      const deleteResult =
        await this.parkingLotRepository.delete(parkingLotIds);

      const deletedCount = deleteResult.affected;
      return deletedCount;
    } catch (error) {
      console.log(error);
      throw new Error('Internal server error');
    }
  }
}
