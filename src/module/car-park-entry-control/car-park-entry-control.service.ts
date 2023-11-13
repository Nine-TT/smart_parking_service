import { Injectable } from '@nestjs/common';
import { Repository, Equal, IsNull, And } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Card } from 'src/entities/card.entity';
import { VehicleManagement } from 'src/entities/vehicle_management.entity';
import { MonthlyTicket } from 'src/entities/monthly_ticket.entity';
import { Price } from 'src/entities/price.enitty';
import { Reevenue } from 'src/entities/revenue.entity';
import { ParkingLocation } from 'src/entities/parking_location.enity';
import { Floor } from 'src/entities/floor.entity';
import * as moment from 'moment';

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

    @InjectRepository(Floor)
    private readonly floorRepository: Repository<Floor>,

    private readonly uploadFile: UploadFile,

    private readonly socketServer: MyGateway,
  ) {}

  async vehicleSwipeIn(data: SwipeIn, file: Express.Multer.File) {
    try {
      const card = await this.cardRepository.findOneBy({
        cardId: data.cardId,
      });

      // const vehicleManagement = await this.vehicleRepository.find({
      //   where: { },
      // });

      // console.log(vehicleManagement);

      // if (vehicleManagement) {
      //   return 5;
      // }

      // const checkState = await this.vehicleRepository.find

      // neu ve thang thi kiem tra han va bien so
      const imgUrl = await this.uploadFile.uploadFile(file, data.folderName);

      if (card.state === true) {
        if (card.isMonthlyTicket === true) {
          const monhtlyTicket = await this.ticketRepository.findOneBy({
            cardId: card.cardId,
          });

          if (monhtlyTicket.licensePlates != data.licensePlates) {
            return 3;
          }

          if (
            moment(monhtlyTicket.expirationDate).isBefore(
              moment(data.timeIn),
              'day',
            ) === true
          ) {
            return 4;
          }

          const vehicle = this.vehicleRepository.create({
            timeIn: data.timeIn,
            licensePlates: data.licensePlates,
            card: card,
            state: vehicle_type.move,
            parkingFee: 0,
            parkingLotId: data.parkingLotId,
            licensePlatesImageUrl: imgUrl,
          });

          await this.vehicleRepository.save(vehicle);

          return 2;
        } else if (card.isMonthlyTicket === false) {
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
      }

      return 0;
    } catch (error) {
      console.log(error);
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

      const parkinglocation = await this.parkingLocationRepository.findOneBy({
        id: data.parkingLocationId,
      });

      const floor = await this.floorRepository.findOneBy({
        id: parkinglocation.floorId,
      });

      if (vehicleManagement) {
        vehicleManagement.state = vehicle_type.parked;
        vehicleManagement.parkingLocationId = data.parkingLocationId;
        vehicleManagement.floorId = floor.id;
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
        this.socketServer.server.emit('onParked', socketData);

        return 1;
      }

      return 0;
    } catch (error) {
      throw new Error('Internal server error');
    }
  }

  async vehicleIsOutDone(data: VehicleOut) {
    try {
      const card = await this.cardRepository.findOneBy({
        cardId: data.cardId,
      });

      const vehicleManagement = await this.vehicleRepository.findOneBy({
        licensePlates: data.licensePlates,
        card: Equal(card.id),
        timeOut: null,
      });

      if (vehicleManagement.state != vehicle_type.done) {
        if (card && card.isMonthlyTicket === true && vehicleManagement) {
          vehicleManagement.state = vehicle_type.done;
          vehicleManagement.timeOut = data.timeOut;
          vehicleManagement.parkingFee = 0;
          await this.vehicleRepository.save(vehicleManagement);

          return 1;
        } else if (
          card &&
          card.isMonthlyTicket === false &&
          vehicleManagement
        ) {
          let priceDay = await this.priceRepository.findOneBy({
            key: ticket_type.regularDayTicket,
          });

          let priceNight = await this.priceRepository.findOneBy({
            key: ticket_type.regularNightTicket,
          });

          let timeIn = vehicleManagement.timeIn;
          let timeOut = data.timeOut;

          let totalMoney = this.calculateParkingFee(
            timeIn,
            timeOut,
            priceDay.price,
            priceNight.price,
          );

          vehicleManagement.state = vehicle_type.done;
          vehicleManagement.timeOut = data.timeOut;
          vehicleManagement.parkingFee = totalMoney;
          await this.vehicleRepository.save(vehicleManagement);

          // toa doanh thu bang reevenue

          const reevenue = this.reevenueRepository.create({
            type: ticket_type.regularTicket,
            expense: totalMoney,
            parkingLotId: vehicleManagement.parkingLotId,
            card: card,
          });

          await this.reevenueRepository.save(reevenue);

          return 2;
        }
      }

      return 0;
    } catch (error) {
      console.log(error);
      throw new Error('Internal server error');
    }
  }

  calculateParkingFee(timeIn, timeOut, dayMoney, nightMoney) {
    let timeInNoTime = this.formattedDay(timeIn);
    let timeOutNoTime = this.formattedDay(timeOut);

    let timeInFomat = moment(timeInNoTime);
    let timeOutFomat = moment(timeOutNoTime);

    const sixAMIn = moment(timeIn).set({
      hour: 6,
      minute: 0,
      second: 0,
      millisecond: 0,
    });
    const sixPMIn = moment(timeIn).set({
      hour: 18,
      minute: 0,
      second: 0,
      millisecond: 0,
    });

    const sixAMOut = moment(timeOut).set({
      hour: 6,
      minute: 0,
      second: 0,
      millisecond: 0,
    });

    const sixPMOut = moment(timeOut).set({
      hour: 18,
      minute: 0,
      second: 0,
      millisecond: 0,
    });

    let dayNumber = timeOutFomat.diff(timeInFomat, 'days');

    let isDayIn =
      moment(timeIn).isAfter(sixAMIn) && moment(timeIn).isBefore(sixPMIn);

    let isDayOut =
      moment(timeOut).isAfter(sixAMOut) && moment(timeOut).isBefore(sixPMOut);

    if (!isDayIn && moment(timeIn).hours() > 0 && moment(timeIn).hours() < 6) {
      dayNumber += 1;
    }

    if (
      !isDayIn &&
      moment(timeOut).hours() > 0 &&
      moment(timeOut).hours() < 6
    ) {
      dayNumber -= 1;
    }

    // console.log('check day:', dayNumber);

    // console.log('===========> is day in:', isDayIn);
    // console.log('===========> is day out:', isDayOut);

    // console.log(dayMoney, nightMoney);

    if (isDayIn && isDayOut) {
      return dayNumber * (dayMoney + nightMoney) + dayMoney;
    } else if (isDayIn && !isDayOut) {
      return dayNumber * (dayMoney + nightMoney);
    } else if (!isDayIn && isDayOut) {
      return dayNumber * (dayMoney + nightMoney);
    } else if (!isDayIn && !isDayOut) {
      return dayNumber * (dayMoney + nightMoney) + nightMoney;
    }
  }

  formattedDay(timeIn) {
    const time = new Date(timeIn);
    const year = time.getFullYear();
    const month = (time.getMonth() + 1).toString().padStart(2, '0'); // Thêm số 0 trước tháng
    const day = time.getDate().toString().padStart(2, '0'); // Thêm số 0 trước ngày

    return `${year}-${month}-${day}`;
  }
}
