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
import { ApiTags, ApiParam } from '@nestjs/swagger';

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

  //   @ApiParam({ name: 'id', type: 'number' })
  //   @Put('/:id')
  //   async changeParkingLocationState(
  //     @Param('id') id: number,
  //     @Body() body: { state: string },
  //   ) {
  //     try {
  //       let state = body.state;
  //       const response =
  //         await this.parkingLocationService.changeParkingLocationState(id, state);

  //       if (response === 1) {
  //         return {
  //           statusCode: HttpStatus.OK,
  //           message: 'Update parking location success!',
  //         };
  //       } else if (response === 0) {
  //         return {
  //           statusCode: HttpStatus.NOT_FOUND,
  //           message: 'Parking location not found!',
  //         };
  //       }
  //     } catch (error) {
  //       throw error;
  //     }
  //   }

  @Post('/update')
  async updateABC(
    @Body()
    body: {
      listblocked?: number[];
      listRoad?: number[];
      listEmpty?: number[];
      floorId?: number;
    },
  ) {
    const response =
      await this.parkingLocationService.changeParkingLocationState(
        body.listblocked,
        body.listRoad,
        body.listEmpty,
        body.floorId,
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
}
