import { Module } from '@nestjs/common';
import { TicketRequestController } from './ticket-request.controller';
import { TicketRequestService } from './ticket-request.service';
import { MonthlyTicketRequest } from 'src/entities/monthly_ticket_request.entity';
import { Reevenue } from 'src/entities/revenue.entity';
import { MonthlyTicket } from 'src/entities/monthly_ticket.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Price } from 'src/entities/price.enitty';
import { Card } from 'src/entities/card.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      MonthlyTicketRequest,
      MonthlyTicket,
      Reevenue,
      Price,
      Card,
    ]),
  ],
  controllers: [TicketRequestController],
  providers: [TicketRequestService],
})
export class TicketRequestModule {}
