import { Module } from '@nestjs/common';
import { CardService } from './card.service';
import { CardController } from './card.controller';
import { Card } from 'src/entities/card.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MyGateway } from '../websocket/event.gateway';

@Module({
  imports: [TypeOrmModule.forFeature([Card])],
  providers: [CardService, MyGateway],
  controllers: [CardController],
})
export class CardModule {}
