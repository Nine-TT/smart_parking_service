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

      if (response != 0) {
        return {
          statusCode: HttpStatus.OK,
          message: 'Car is move in park!',
        };
      } else {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Card is locked!',
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
      }
    } catch (error) {
      throw error;
    }
  }

  @Put('/out')
  @ApiBody({ type: VehicleOut })
  async checkOutDone(@Body() data: VehicleOut) {
    const response = await this.vehicleService.vehicleIsOutDone(data);
  }
}
