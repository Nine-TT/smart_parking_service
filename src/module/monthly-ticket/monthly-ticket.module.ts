import { Module } from '@nestjs/common';
import { MonthlyTicketController } from './monthly-ticket.controller';
import { MonthlyTicketService } from './monthly-ticket.service';
import { MonthlyTicket } from 'src/entities/monthly_ticket.entity';
import { Reevenue } from 'src/entities/revenue.entity';
import { Card } from 'src/entities/card.entity';
import { Price } from 'src/entities/price.enitty';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([MonthlyTicket, Reevenue, Card, Price])],
  controllers: [MonthlyTicketController],
  providers: [MonthlyTicketService],
})
export class MonthlyTicketModule {}
