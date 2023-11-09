import { Controller, HttpStatus, Get, Patch, Body } from '@nestjs/common';
import { ApiTags, ApiBody } from '@nestjs/swagger';
import { PriceDto } from 'src/dto/price.dto';
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

  @Patch('')
  @ApiBody({ type: PriceDto })
  async updatePrice(@Body() data: PriceDto) {
    try {
      const response = await this.priceService.updatePrice(data);

      if (response != 0) {
        return {
          statusCode: HttpStatus.OK,
          message: 'Update successfully!',
        };
      } else {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Key not found!',
        };
      }
    } catch (error) {
      throw error;
    }
  }
}
