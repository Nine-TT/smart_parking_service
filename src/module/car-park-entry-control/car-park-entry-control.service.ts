import { Injectable } from '@nestjs/common';
import { Repository, Equal } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Card } from 'src/entities/card.entity';
import { VehicleManagement } from 'src/entities/vehicle_management.entity';
import { MonthlyTicket } from 'src/entities/monthly_ticket.entity';
import { Price } from 'src/entities/price.enitty';
import { Reevenue } from 'src/entities/revenue.entity';
import { ParkingLocation } from 'src/entities/parking_location.enity';
import {
  SwipeIn,
  ParkedDTO,
  VehicleOut,
} from 'src/dto/car-park-entry-control.dto';
import { UploadFile } from 'src/util/upload-file';
import {
  vehicle_type,
  paking_location_state,
  ticket_type,
} from 'src/constants';
import { MyGateway } from '../websocket/event.gateway';

@Injectable()
export class CarParkEntryControlService {
  constructor(
    @InjectRepository(VehicleManagement)
    private readonly vehicleRepository: Repository<VehicleManagement>,

    @InjectRepository(Reevenue)
    private readonly reevenueRepository: Repository<Reevenue>,

    @InjectRepository(Price)
    private readonly priceRepository: Repository<Price>,

    @InjectRepository(Card)
    private readonly cardRepository: Repository<Card>,

    @InjectRepository(MonthlyTicket)
    private readonly ticketRepository: Repository<MonthlyTicket>,

    @InjectRepository(ParkingLocation)
    private readonly parkingLocationRepository: Repository<ParkingLocation>,

    private readonly uploadFile: UploadFile,

    private readonly socketServer: MyGateway,
  ) {}

  async vehicleSwipeIn(data: SwipeIn, file: Express.Multer.File) {
    try {
      const card = await this.cardRepository.findOneBy({
        cardId: data.cardId,
      });

      // const checkState = await this.vehicleRepository.find

      const imgUrl = await this.uploadFile.uploadFile(file, data.folderName);

      if (card.state === true) {
        const vehicle = this.vehicleRepository.create({
          timeIn: data.timeIn,
          licensePlates: data.licensePlates,
          card: card,
          state: vehicle_type.move,
          parkingLotId: data.parkingLotId,
          licensePlatesImageUrl: imgUrl,
        });

        await this.vehicleRepository.save(vehicle);

        return 1;
      }

      return 0;
    } catch (error) {
      throw new Error('Internal server error');
    }
  }

  async vehicleIsParked(data: ParkedDTO) {
    try {
      const vehicleManagement = await this.vehicleRepository.findOneBy({
        licensePlates: data.licensePlates,
        state: vehicle_type.move,
        timeOut: null,
      });

      if (vehicleManagement) {
        vehicleManagement.state = vehicle_type.parked;
        vehicleManagement.parkingLocationId = data.parkingLocationId;
        await this.vehicleRepository.save(vehicleManagement);

        await this.parkingLocationRepository.update(
          { id: data.parkingLocationId },
          {
            vehicleManagement: vehicleManagement,
            state: paking_location_state.has_vehicle,
          },
        );

        let socketData = {
          message: 'Xe da do vao cho!',
          parkingLotId: vehicleManagement.parkingLotId,
        };
        this.socketServer.server.emit('onParked', socketData);

        return 1;
      }

      return 0;
    } catch (error) {
      throw new Error('Internal server error');
    }
  }

  async vehicleIsMoveOut(data: ParkedDTO) {
    try {
      const vehicleManagement = await this.vehicleRepository.findOneBy({
        licensePlates: data.licensePlates,
        state: vehicle_type.parked,
        timeOut: null,
      });

      if (vehicleManagement) {
        vehicleManagement.state = vehicle_type.move;
        await this.vehicleRepository.save(vehicleManagement);

        await this.parkingLocationRepository.update(
          { id: data.parkingLocationId },
          {
            vehicleManagement: null,
            state: paking_location_state.empty,
          },
        );

        let socketData = {
          message: 'Xe dang di chuyen trong bai!',
          parkingLotId: vehicleManagement.parkingLotId,
        };
        this.socketServer.server.emit('onMove', socketData);

        return 1;
      }

      return 0;
    } catch (error) {
      throw new Error('Internal server error');
    }
  }

  async vehicleIsOutDone(data: VehicleOut) {
    try {
      const now = new Date();
      const isoStringNow = now.toISOString();
      console.log(isoStringNow);

      const card = await this.cardRepository.findOneBy({
        cardId: data.cardId,
      });

      const vehicleManagement = await this.vehicleRepository.findOneBy({
        licensePlates: data.licensePlates,
        card: Equal(card.id),
        timeOut: null,
      });

      // const timeIn = vehicleManagement.timeIn;
      // const timeOut = data.timeOut;

      // if (vehicleManagement) {
      //   vehicleManagement.timeOut = data.timeOut;
      //   vehicleManagement.state = vehicle_type.done;

      //   await this.vehicleRepository.save(vehicleManagement);

      //   // tao doanh thu ----> check thoi gian xem neu ban ngay thi tinh tien ngay, neu qua dem thi tinh tien dem, neu 2-3 ngay thi tinh tien 2-3 ngay
      //   let price = await this.priceRepository.findOneBy({
      //     key: ticket_type.monthlyTicket,
      //   });

      //   const reevenue = this.reevenueRepository.create({
      //     type: ticket_type.monthlyTicket,
      //     expense: price.price,
      //     parkingLotId: null,
      //     card: card,
      //   });

      //   await this.reevenueRepository.save(reevenue);

      //   let socketData = {
      //     message: 'Xe da do vao cho!',
      //     parkingLotId: vehicleManagement.parkingLotId,
      //   };
      //   this.socketServer.server.emit('onParked', socketData);

      //   return 1;
      // }

      return 0;
    } catch (error) {
      throw new Error('Internal server error');
    }
  }
}
