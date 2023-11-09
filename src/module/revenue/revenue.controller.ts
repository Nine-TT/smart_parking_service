import { Controller, Get, Query, HttpStatus } from '@nestjs/common';
import { RevenueService } from './revenue.service';
import { ApiTags, ApiQuery } from '@nestjs/swagger';

@ApiTags('Revenue')
@Controller('revenue')
export class RevenueController {
  constructor(private readonly revenueService: RevenueService) {}

  @Get('')
  @ApiQuery({ name: 'year', type: Number, required: false })
  @ApiQuery({ name: 'type', type: String, required: false })
  async getTotal(@Query('year') year?: number, @Query('type') type?: string) {
    const response = await this.revenueService.getTotalRevenue(year, type);

    if (response) {
      return {
        statusCode: HttpStatus.OK,
        data: response,
      };
    } else {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Bad request!',
        data: response,
      };
    }
  }
}
