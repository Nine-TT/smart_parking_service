import { Controller, HttpStatus, Post, Body, Put, Get } from '@nestjs/common';
import { ApiTags, ApiBody } from '@nestjs/swagger';
import { TicketRequestService } from './ticket-request.service';
import {
  TicketRequestDTO,
  TicketRequestAcceptDTO,
} from 'src/dto/ticket-request.dto';

@ApiTags('Ticket request')
@Controller('ticket-request')
export class TicketRequestController {
  constructor(private readonly requestService: TicketRequestService) {}

  @Post('')
  @ApiBody({ type: TicketRequestDTO })
  async createRequest(@Body() requestDTO: TicketRequestDTO) {
    try {
      const response = await this.requestService.createRequest(requestDTO);

      if (response != 0) {
        return {
          statusCode: HttpStatus.OK,
          message: 'create request successfully!',
          data: response,
        };
      } else {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'create request fail!',
        };
      }
    } catch (error) {
      throw error;
    }
  }

  @Put('')
  @ApiBody({ type: TicketRequestAcceptDTO })
  async acceptRequest(@Body() acceptDTO: TicketRequestAcceptDTO) {
    const response = await this.requestService.acceptRequest(acceptDTO);

    if (response != 0) {
      return {
        statusCode: HttpStatus.OK,
        message: 'Accept successfully!',
      };
    } else {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Accept fail!',
      };
    }
  }

  @Get('')
  async getAllRequest() {
    try {
      const response = await this.requestService.getAllTicketRequest();

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
}
