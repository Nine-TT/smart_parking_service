import { Module } from '@nestjs/common';
import { MonthlyTicketController } from './monthly-ticket.controller';
import { MonthlyTicketService } from './monthly-ticket.service';

@Module({
  controllers: [MonthlyTicketController],
  providers: [MonthlyTicketService]
})
export class MonthlyTicketModule {}
