import {
  Controller,
  Body,
  Post,
  HttpStatus,
  Get,
  Param,
  Patch,
  Put,
} from '@nestjs/common';
import { MonthlyTicketService } from './monthly-ticket.service';
import { ApiTags, ApiBody, ApiParam } from '@nestjs/swagger';
import {
  MonthlyTicketDTO,
  UpdateLicensePlates,
  ExtendMonthlyTicket,
} from 'src/dto/monthly-ticket.dto';

@ApiTags('Monthly ticket')
@Controller('monthly-ticket')
export class MonthlyTicketController {
  constructor(private readonly ticketService: MonthlyTicketService) {}

  @Post('')
  @ApiBody({ type: MonthlyTicketDTO })
  async createMonthlyTicket(@Body() ticketDTO: MonthlyTicketDTO) {
    try {
      const response = await this.ticketService.createTicket(ticketDTO);

      if (response != 0) {
        return {
          statusCode: HttpStatus.OK,
          message: 'Create monthly ticket successfully!',
        };
      } else {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Create monthly ticket fail!',
        };
      }
    } catch (error) {
      throw error;
    }
  }

  @ApiParam({ name: 'page', type: Number })
  @ApiParam({ name: 'pageSize', type: Number })
  @Get('/all/:page/:pageSize')
  async getMonthlyTicket(
    @Param('page') page: number,
    @Param('pageSize') pageSize: number,
  ) {
    try {
      const response = await this.ticketService.getAllMonthlyTicket({
        page,
        pageSize,
      });

      if (response) {
        return {
          statusCode: HttpStatus.OK,
          count: response.count,
          data: response.cards,
        };
      }
      return 0;
    } catch (error) {
      throw error;
    }
  }

  @Patch('')
  @ApiBody({ type: UpdateLicensePlates })
  async updateLicensePlates(@Body() updateDTO: UpdateLicensePlates) {
    try {
      const response = await this.ticketService.updateLicensePlates(updateDTO);

      if (response != 0) {
        return {
          statusCode: HttpStatus.OK,
          data: response,
        };
      } else {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          data: [],
        };
      }
    } catch (error) {
      throw error;
    }
  }

  @Put('')
  @ApiBody({ type: ExtendMonthlyTicket })
  async extendMonthlyTicket(@Body() data: ExtendMonthlyTicket) {
    try {
      const response = await this.ticketService.extendMonthlyTicket(data);

      if (response != 0) {
        return {
          statusCode: HttpStatus.OK,
          message: 'Extend Monthly Ticket successfully!',
        };
      } else {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Extend Monthly Ticket fail!',
        };
      }
    } catch (error) {
      throw error;
    }
  }
}
