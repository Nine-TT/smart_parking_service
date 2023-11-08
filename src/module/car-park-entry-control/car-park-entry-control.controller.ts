import {
  Controller,
  Body,
  Post,
  UploadedFile,
  HttpStatus,
  UseInterceptors,
  Put,
  Patch,
} from '@nestjs/common';
import { ApiTags, ApiBody } from '@nestjs/swagger';
import {
  SwipeIn,
  ParkedDTO,
  VehicleOut,
} from 'src/dto/car-park-entry-control.dto';
import { CarParkEntryControlService } from './car-park-entry-control.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { response } from 'express';

@Controller('entry-control')
@ApiTags('Entry control')
export class CarParkEntryControlController {
  constructor(private readonly vehicleService: CarParkEntryControlService) {}

  @Post('/coming-in')
  @UseInterceptors(FileInterceptor('file'))
  async vehicleSwipeIn(
    @Body() data: SwipeIn,
    @UploadedFile() file: Express.Multer.File,
  ) {
    try {
      const response = await this.vehicleService.vehicleSwipeIn(data, file);

      if (response === 1) {
        return {
          statusCode: HttpStatus.OK,
          isMonthlyticket: false,
          message: 'Car is move in park!',
        };
      } else if (response === 2) {
        return {
          statusCode: HttpStatus.OK,
          isMonthlyticket: true,
          message: 'Car is move in park!',
        };
      } else if (response === 0) {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Card is locked!',
        };
      } else if (response === 3) {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          isMonthlyticket: true,
          message: 'No matching license plates!',
        };
      } else if (response === 4) {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          isMonthlyticket: true,
          message: 'Monthly ticket expires!',
        };
      } else if (response === 5) {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'The card has a vehicle in use that has not left the lot!',
        };
      }
    } catch (error) {
      throw error;
    }
  }

  @Put('/parked')
  @ApiBody({ type: ParkedDTO })
  async changeStateParked(@Body() data: ParkedDTO) {
    try {
      const response = await this.vehicleService.vehicleIsParked(data);

      if (response != 0) {
        return {
          statusCode: HttpStatus.OK,
          message: 'Car is parked!',
        };
      } else {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Vehicle not found!',
        };
      }
    } catch (error) {
      throw error;
    }
  }

  @Patch('/move-out')
  @ApiBody({ type: ParkedDTO })
  async changeStateMoveOut(@Body() data: ParkedDTO) {
    try {
      const response = await this.vehicleService.vehicleIsMoveOut(data);

      if (response != 0) {
        return {
          statusCode: HttpStatus.OK,
          message: 'Car is moving out!',
        };
      } else {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Vehicle not found!',
        };
      }
    } catch (error) {
      throw error;
    }
  }

  @Put('/out')
  @ApiBody({ type: VehicleOut })
  async checkOutDone(@Body() data: VehicleOut) {
    try {
      const response = await this.vehicleService.vehicleIsOutDone(data);

      if (response === 1) {
        return {
          statusCode: HttpStatus.OK,
          cardIsMonthly: true,
          message: 'The car has left the gate',
        };
      } else if (response === 2) {
        return {
          statusCode: HttpStatus.OK,
          cardIsMonthly: false,
          message: 'The car has left the gate',
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
