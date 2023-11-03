import {
  Controller,
  HttpStatus,
  Body,
  Post,
  Get,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { FloorService } from './floor.service';
import { FloorDTO } from 'src/dto/floor.dto';
import { ApiTags, ApiBody, ApiParam } from '@nestjs/swagger';

@ApiTags('Floor')
@Controller('floor')
export class FloorController {
  constructor(private readonly floorService: FloorService) {}

  @Post('')
  @ApiBody({ type: FloorDTO })
  async createFloor(@Body() FloorDTO: FloorDTO) {
    try {
      const response = await this.floorService.createFloor(FloorDTO);

      if (response) {
        return {
          statusCode: HttpStatus.OK,
          message: 'Create floor successfully!',
          Data: response,
        };
      } else {
        return {
          statusCode: HttpStatus.OK,
          message: 'Create floor fail!',
        };
      }
    } catch (error) {
      throw error;
    }
  }

  @Get('/:parkingLotId')
  @ApiParam({ name: 'parkingLotId', type: 'number' })
  async getAllFloor(@Param('parkingLotId') parkingLotId: number) {
    try {
      const response =
        await this.floorService.getFloorByParkingLotId(parkingLotId);

      if (response) {
        return {
          statusCode: HttpStatus.OK,
          message: 'Get all floor success!',
          data: response,
        };
      } else {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Not found floor with parking lot id!',
          data: response,
        };
      }
    } catch (error) {
      throw error;
    }
  }

  @Put('/:id')
  @ApiParam({ name: 'id', type: 'number' })
  @ApiBody({})
  async updateFloorInfo(
    @Param('id') id: number,
    @Body() body: { name: string },
  ) {
    try {
      const response = await this.floorService.updateFloorInfo(id, body);

      if (response != 0) {
        return {
          statusCode: HttpStatus.OK,
          message: 'Update floor info successfully!',
        };
      } else {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Floor not found!',
        };
      }
    } catch (error) {
      throw error;
    }
  }

  @Delete('/:ids')
  @ApiParam({ name: 'ids', type: 'string' })
  async deleteFloor(@Param('ids') ids: string) {
    try {
      const idArray = ids.split(',').map((id) => parseInt(id, 10));
      const response = await this.floorService.deleteFloor(idArray);

      if (response != 0) {
        return {
          statusCode: HttpStatus.OK,
          message: 'Delete floor successfully!',
        };
      } else {
        return {
          statusCode: HttpStatus.OK,
          message: 'Floor id not found!',
        };
      }
    } catch (error) {
      throw error;
    }
  }
}
