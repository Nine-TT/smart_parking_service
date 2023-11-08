import {
  Controller,
  HttpStatus,
  Get,
    
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PriceService } from './price.service';

@ApiTags('price')
@Controller('price')
export class PriceController {
  constructor(private readonly priceService: PriceService) {}
  @Get('')
  async getAllPrice() {
    try {
      const response = await this.priceService.getAllPrice();
      if (response) {
        return {
          statusCode: HttpStatus.OK,
          data: response,
        };
      } else {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          data: [],
        };
      }
    } catch (error) {
      throw error;
    }
  }
}
