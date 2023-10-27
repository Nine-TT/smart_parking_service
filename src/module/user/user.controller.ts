import {
  Body,
  Controller,
  Get,
  Post,
  HttpStatus,
  Put,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiTags, ApiParam } from '@nestjs/swagger';
import { UserService } from './user.service';
import { CreateUserDTO } from 'src/dto/user.dto';
import { RolesGuard } from 'src/middleware/roles.guard';
import { AuthGuard } from 'src/middleware/auth.guard';
import { Roles } from 'src/constants';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/create')
  @ApiBody({ type: CreateUserDTO })
  async createUSer(@Body() createUSerDTO: CreateUserDTO) {
    try {
      const response = await this.userService.createUser(createUSerDTO);

      if (response === 1) {
        return {
          statusCode: 409,
          message: 'Email already exist!',
        };
      }

      return {
        statusCode: HttpStatus.OK,
        message: 'Create user success',
        Data: response,
      };
    } catch (error) {
      throw error;
    }
  }

  @Put('/:id')
  @ApiParam({ name: 'id', type: 'number' })
  async updateUser(
    @Body() createUserDTO: CreateUserDTO,
    @Param() params: any,
  ): Promise<{
    statusCode: HttpStatus;
    message: string;
  }> {
    try {
      let userID = Number(params.id);
      const response = await this.userService.updateUser(createUserDTO, userID);

      if (response === 0) {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'User already exist!',
        };
      } else {
        return {
          statusCode: HttpStatus.OK,
          message: 'Update user success',
        };
      }
    } catch (error) {
      throw error;
    }
  }

  @ApiParam({ name: 'ids', type: 'string' })
  @Delete('/:ids')
  async deleteUser(@Param('ids') ids: string): Promise<{
    statusCode: HttpStatus;
    message: string;
  }> {
    try {
      const idArray = ids.split(',').map((id) => parseInt(id, 10));

      // Gọi hàm xóa người dùng từ UserService
      const deletedCount = await this.userService.deleteUSerById(idArray);

      if (deletedCount != 0) {
        return {
          statusCode: HttpStatus.OK,
          message: 'Delete user successful!',
        };
      }
    } catch (error) {
      throw error;
    }
  }

  // @UseGuards(AuthGuard)
  @Get('/:id')
  @ApiParam({ name: 'id', type: 'number' })
  async getUserById(@Param('id') id: any) {
    try {
      let idInt = Number(id);
      let response = await this.userService.getUserById(idInt);

      if (response === 0) {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'User already exist!',
        };
      } else {
        return {
          statusCode: HttpStatus.OK,
          message: 'Get user successful!',
          Data: response,
        };
      }
    } catch (error) {
      console.log('Check error: ', error);
      throw error;
    }
  }

  @UseGuards(AuthGuard) // check token
  @UseGuards(RolesGuard) // check role
  @Roles('Admin')
  @Get('/all')
  async getAllUsers(@Body() body: { page: number; pageSize: number }) {
    try {
      const response = await this.userService.getUsersWithCount(
        body.page,
        body.pageSize,
      );

      return {
        statusCode: HttpStatus.OK,
        message: 'Get user successful!',
        Data: response,
      };
    } catch (error) {
      throw error;
    }
  }
}
