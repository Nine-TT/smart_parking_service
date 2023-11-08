import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Price } from '../../entities/price.enitty';
import { Repository } from 'typeorm';

@Injectable()
export class PriceService {
  constructor(
    @InjectRepository(Price)
    private readonly cardRepository: Repository<Price>,
  ) {}

  async getAllPrice() {
    try {
      const requests = await this.cardRepository.find();
      return requests;
    } catch (error) {
      throw new Error('Internal server error');
    }
  }
}
