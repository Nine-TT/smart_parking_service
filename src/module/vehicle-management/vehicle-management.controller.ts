import { Controller, Param, Get, HttpStatus, Query } from '@nestjs/common';
import { ApiTags, ApiParam, ApiQuery } from '@nestjs/swagger';
import { VehicleManagementService } from './vehicle-management.service';

@ApiTags('Vehicle management')
@Controller('vehicle-management')
export class VehicleManagementController {
  constructor(private readonly vehicleService: VehicleManagementService) {}

  @ApiQuery({ name: 'parkingLotId', type: Number, required: false })
  @ApiQuery({ name: 'floorId', type: Number, required: false })
  @ApiQuery({ name: 'state', type: String })
  @ApiQuery({ name: 'page', type: Number })
  @ApiQuery({ name: 'pageSize', type: Number })
  @Get('/all')
  async getVehicleManagement(
    @Query('page') page: number,
    @Query('pageSize') pageSize: number,
    @Query('state') state: string,
    @Query('parkingLotId') parkingLotId?: number,
    @Query('floorId') floorId?: number,
  ) {
    try {
      const response = await this.vehicleService.getVehicleManagementWithCount(
        page,
        pageSize,
        state,
        parkingLotId,
        floorId,
      );

      if (response) {
        return {
          statusCode: HttpStatus.OK,
          count: response.count,
          data: response.vehicles,
        };
      } else {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Bad request!',
        };
      }
    } catch (error) {
      throw error;
    }
  }

  @Get('/:bs')
  @ApiParam({ name: 'bs', type: String })
  async findCar(@Param('bs') bs: string) {
    try {
      const response = await this.vehicleService.findCarsWithBS(bs);

      if (response) {
        return {
          statusCode: HttpStatus.OK,
          data: response,
        };
      } else {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Bad request!',
        };
      }
    } catch (error) {
      throw error;
    }
  }
}
