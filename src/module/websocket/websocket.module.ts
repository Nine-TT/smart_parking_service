import { Module } from '@nestjs/common';
import { WebsocketService } from './websocket.service';
import { MyGateway } from './event.gateway';

@Module({
  providers: [WebsocketService, MyGateway],
})
export class WebsocketModule {}
