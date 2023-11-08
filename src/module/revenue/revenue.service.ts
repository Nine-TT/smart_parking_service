import { Injectable } from '@nestjs/common';
import { Reevenue } from 'src/entities/revenue.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ticket_type } from 'src/constants';

@Injectable()
export class RevenueService {
  constructor(
    @InjectRepository(Reevenue)
    private readonly revenueRepository: Repository<Reevenue>,
  ) {}
}
