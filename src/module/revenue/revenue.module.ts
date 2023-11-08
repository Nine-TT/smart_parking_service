import { Module } from '@nestjs/common';
import { RevenueController } from './revenue.controller';
import { RevenueService } from './revenue.service';
import { Reevenue } from 'src/entities/revenue.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Reevenue])],
  controllers: [RevenueController],
  providers: [RevenueService],
})
export class RevenueModule {}
