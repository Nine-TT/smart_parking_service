import {
  Controller,
  HttpStatus,
  Body,
  Param,
  Post,
  Get,
  Delete,
  Put,
  UseGuards,
} from '@nestjs/common';

import { ApiTags, ApiBody, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { ParkingLotService } from './parkingLot.service';
import { ParkingLotDto } from 'src/dto/parkingLot.dto';
import { RolesGuard } from 'src/middleware/roles.guard';
import { AuthGuard } from 'src/middleware/auth.guard';
import { Roles, userRole } from 'src/constants';

@UseGuards(AuthGuard) // check token
@UseGuards(RolesGuard) // check role
@Roles(userRole.admin) // role Admin
@ApiTags('ParkingLot')
@ApiBearerAuth()
@Controller('parkinglot')
export class ParkingLotController {
  constructor(private readonly parkingLotService: ParkingLotService) {}

  @Post('/')
  @ApiBody({ type: ParkingLotDto })
  async createParkingLot(@Body() createParkingLotDTO: ParkingLotDto) {
    try {
      const response =
        await this.parkingLotService.createParkingLot(createParkingLotDTO);
      if (response) {
        return {
          statusCode: HttpStatus.OK,
          message: 'Create parking lot successfully',
          Data: response,
        };
      } else {
        return {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Create parking lot failedly',
        };
      }
    } catch (error) {
      throw error;
    }
  }

  @Put('/:id')
  @ApiParam({ name: 'id', type: 'number' })
  @ApiBody({ type: ParkingLotDto })
  async updateParkingLot(
    @Body() createParkingLotDTO: ParkingLotDto,
    @Param() params: any,
  ): Promise<{
    statusCode: HttpStatus;
    message: string;
  }> {
    try {
      let userID = Number(params.id);
      const response = await this.parkingLotService.updateParkingLot(
        createParkingLotDTO,
        userID,
      );

      if (response === 0) {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Parking lot does not exist!',
        };
      } else {
        return {
          statusCode: HttpStatus.OK,
          message: 'Update parking lot successfully',
        };
      }
    } catch (error) {
      throw error;
    }
  }

  @ApiParam({ name: 'page', type: Number })
  @ApiParam({ name: 'pageSize', type: Number })
  @Get('/all/:page/:pageSize')
  async getAllUsers(
    @Param('page') page: number,
    @Param('pageSize') pageSize: number,
  ) {
    try {
      const response = await this.parkingLotService.getAllParkingLot({
        page,
        pageSize,
      });

      return {
        statusCode: HttpStatus.OK,
        message: 'Get card successful!',
        count: response.count,
        Data: response.parkingLots,
      };
    } catch (error) {
      throw error;
    }
  }

  @Get('/:id')
  @ApiParam({ name: 'id', type: 'number' })
  async getParkingLotByID(@Param('id') id: number) {
    try {
      let idInt = Number(id);
      let response = await this.parkingLotService.getParkingLotById(idInt);

      if (response === 0) {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Parking Lot does not exist!',
        };
      } else {
        return {
          statusCode: HttpStatus.OK,
          message: 'Get parking lot successfully!',
          Data: response,
        };
      }
    } catch (error) {
      console.log('Check error: ', error);
      throw error;
    }
  }

  @ApiParam({ name: 'ids', type: 'string' })
  @Delete('/:ids')
  async deleteParkingLot(@Param('ids') ids: string) {
    try {
      const idArray = ids.split(',').map((id) => parseInt(id, 10));

      const deletedCount =
        await this.parkingLotService.deleteParkingLotByID(idArray);

      if (deletedCount != 0) {
        return {
          statusCode: HttpStatus.OK,
          count: deletedCount,
          message: 'Delete parking lot successfully!',
        };
      }
    } catch (error) {
      throw error;
    }
  }
}
