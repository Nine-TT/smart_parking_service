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
import { ApiTags, ApiBody, ApiParam } from '@nestjs/swagger';
import { CardService } from './card.service';
import { CardDto } from 'src/dto/card.dto';
import { RolesGuard } from 'src/middleware/roles.guard';
import { AuthGuard } from 'src/middleware/auth.guard';
import { Roles, userRole } from 'src/constants';

@UseGuards(AuthGuard) // check token
@UseGuards(RolesGuard) // check role
@Roles(userRole.admin) // role Admin
@ApiTags('Card')
@Controller('card')
export class CardController {
  constructor(private readonly cardService: CardService) {}

  @Post('/')
  @ApiBody({ type: CardDto })
  async createCard(@Body() createCardDTO: CardDto) {
    try {
      const response = await this.cardService.createCard(createCardDTO);
      if (response) {
        return {
          statusCode: HttpStatus.OK,
          message: 'Create card success',
          Data: response,
        };
      } else {
        return {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Create card fail',
        };
      }
    } catch (error) {
      throw error;
    }
  }

  @Get('/:id')
  @ApiParam({ name: 'id', type: 'string' })
  async getCardByID(@Param('id') id: string) {
    try {
      const response = await this.cardService.getCardById(id);

      if (response) {
        return {
          statusCode: HttpStatus.OK,
          Data: response,
        };
      } else {
        return {
          statusCode: HttpStatus.OK,
          Data: response,
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
      const response = await this.cardService.getAllCard({
        page,
        pageSize,
      });

      return {
        statusCode: HttpStatus.OK,
        message: 'Get card successful!',
        count: response.count,
        Data: response.cards,
      };
    } catch (error) {
      throw error;
    }
  }

  @Put('/:id')
  @ApiParam({ name: 'id', type: 'string' })
  @ApiBody({ type: CardDto })
  async updateCard(@Body() cardDTO: CardDto, @Param() params: any) {
    try {
      let cardID = params.id;
      const response = await this.cardService.updateCard(cardDTO, cardID);

      if (response === 0) {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Card already exist!',
        };
      } else {
        return {
          statusCode: HttpStatus.OK,
          message: 'Update card success',
        };
      }
    } catch (error) {
      throw error;
    }
  }

  @ApiParam({ name: 'ids', type: 'string' })
  @Delete('/:ids')
  async deleteUser(@Param('ids') ids: string) {
    try {
      // Tách chuỗi ID thành mảng các ID
      const idArray = ids.split(',');

      const deletedCount = await this.cardService.deleteCard(idArray);

      if (deletedCount === 0) {
        return {
          statusCode: HttpStatus.OK,
          count: deletedCount,
          message: 'Delete 0 successful!',
        };
      } else {
        return {
          statusCode: HttpStatus.OK,
          count: deletedCount,
          message: `Delete ${deletedCount} successful!`,
        };
      }
    } catch (error) {
      throw error;
    }
  }
}
