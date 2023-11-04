import {
  Controller,
  HttpStatus,
  Param,
  Body,
  Get,
  Delete,
  Put,
  Post,
} from '@nestjs/common';
import { ParkingLocationService } from './parking-location.service';
import { ApiTags, ApiParam, ApiBody } from '@nestjs/swagger';
import {
  ParkingLocationDTO,
  AddNewParkingLocationDTO,
} from 'src/dto/parking-location.dto';

@ApiTags('Parking Location')
@Controller('parking-location')
export class ParkingLocationController {
  constructor(
    private readonly parkingLocationService: ParkingLocationService,
  ) {}

  @ApiParam({ name: 'id', type: 'number' })
  @Get('/:id')
  async getParkingLocationInfo(@Param('id') id: number) {
    try {
      const response =
        await this.parkingLocationService.getParkingLocationInfo(id);

      if (response != 0) {
        return {
          statusCode: HttpStatus.OK,
          message: 'Get parking location info success!',
          data: response,
        };
      } else {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Parking location not found!',
        };
      }
    } catch (error) {
      throw error;
    }
  }

  @Put('')
  @ApiBody({ type: ParkingLocationDTO })
  async updateABC(@Body() parkingLocationDTO: ParkingLocationDTO) {
    const response =
      await this.parkingLocationService.changeParkingLocationState(
        parkingLocationDTO.listblocked,
        parkingLocationDTO.listRoad,
        parkingLocationDTO.listEmpty,
        parkingLocationDTO.floorId,
      );

    if (response === 1) {
      return {
        statusCode: HttpStatus.OK,
      };
    } else {
      return {
        statusCode: HttpStatus.NOT_FOUND,
      };
    }
  }

  @Get('/all/:floorId')
  @ApiParam({ name: 'floorId', type: 'number' })
  async getAllParkingLocationByFloorId(@Param('floorId') floorId: number) {
    try {
      const response =
        await this.parkingLocationService.getAllParkingLocationByFloorId(
          floorId,
        );

      if (response) {
        return {
          statusCode: HttpStatus.OK,
          message: 'Get successfully!',
          data: response,
        };
      }
    } catch (error) {
      throw error;
    }
  }

  @Post('')
  @ApiBody({ type: AddNewParkingLocationDTO })
  async addNewParkinglocation(@Body() addNewDTO: AddNewParkingLocationDTO) {
    try {
      const response = await this.parkingLocationService.addNewParkingLocation(
        addNewDTO.floorId,
        addNewDTO.quantity,
      );

      if (response != 0) {
        return {
          statusCode: HttpStatus.OK,
          message: 'Add successfully!',
        };
      } else {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'FloorId not found!',
        };
      }
    } catch (error) {
      throw error;
    }
  }
}
