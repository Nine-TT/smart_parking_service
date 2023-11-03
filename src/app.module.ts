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
import { FileHandlingModule } from './util/file/fileHandle.module';

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
    FileHandlingModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
  ],
})
export class AppModule {}
