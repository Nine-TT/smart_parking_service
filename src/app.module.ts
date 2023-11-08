import { Module, ClassSerializerInterceptor } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './module/user/user.module';
import { DatabseModule } from './database/databse.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AuthModule } from './module/auth/auth.module';
import { WebsocketModule } from './module/websocket/websocket.module';
import { CardModule } from './module/card/card.module';
import { ParkingLotModule } from './module/parkingLot/parkingLot.module';
import { FloorModule } from './module/floor/floor.module';
import { ParkingLocationModule } from './module/parking-location/parking-location.module';
import { MonthlyTicketRequest } from './entities/monthly_ticket_request.entity';
import { MonthlyTicket } from './entities/monthly_ticket.entity';
import { Price } from './entities/price.enitty';
import { UploadFile } from './util/upload-file';
import { TicketRequestModule } from './module/ticket-request/ticket-request.module';
import { MonthlyTicketModule } from './module/monthly-ticket/monthly-ticket.module';
import { CarParkEntryControlModule } from './module/car-park-entry-control/car-park-entry-control.module';
import { RevenueModule } from './module/revenue/revenue.module';
import { VehicleManagementModule } from './module/vehicle-management/vehicle-management.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    DatabseModule,
    UserModule,
    AuthModule,
    WebsocketModule,
    CardModule,
    ParkingLotModule,
    FloorModule,
    ParkingLocationModule,
    MonthlyTicketRequest,
    MonthlyTicket,
    Price,
    TicketRequestModule,
    MonthlyTicketModule,
    CarParkEntryControlModule,
    RevenueModule,
    VehicleManagementModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
    UploadFile,
  ],
})
export class AppModule {}
