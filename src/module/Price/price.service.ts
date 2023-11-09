import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Price } from '../../entities/price.enitty';
import { Repository } from 'typeorm';
import { PriceDto } from 'src/dto/price.dto';

@Injectable()
export class PriceService {
  constructor(
    @InjectRepository(Price)
    private readonly priceRepository: Repository<Price>,
  ) {}

  async getAllPrice() {
    try {
      const requests = await this.priceRepository.find();
      return requests;
    } catch (error) {
      throw new Error('Internal server error');
    }
  }

  async updatePrice(data: PriceDto) {
    try {
      const price = await this.priceRepository.findOneBy({
        key: data.key,
      });

      if (price) {
        price.price = data.price;

        await this.priceRepository.save(price);
        return 1;
      }

      return 0;
    } catch (error) {
      throw new Error('Internal server error');
    }
  }
}
