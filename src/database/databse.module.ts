import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Floor } from 'src/entities/floor.entity';
import { Card } from 'src/entities/card.entity';
import { ParkingLocation } from 'src/entities/parking_location.enity';
import { ParkingLot } from 'src/entities/parking_lot.enity';
import { Reevenue } from 'src/entities/revenue.entity';
import { VehicleManagement } from 'src/entities/vehicle_management.entity';
import { MonthlyTicketRequest } from 'src/entities/monthly_ticket_request.entity';
import { MonthlyTicket } from 'src/entities/monthly_ticket.entity';
import { Price } from 'src/entities/price.enitty';
import 'dotenv/config';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USER_NAME,
      password: process.env.BD_PASSWORD,
      database: process.env.DB_NAME,
      entities: [
        User,
        Card,
        VehicleManagement,
        ParkingLot,
        ParkingLocation,
        Floor,
        Reevenue,
        MonthlyTicketRequest,
        MonthlyTicket,
        Price,
      ],
      synchronize: true,
    }),
  ],
})
export class DatabseModule {}
