import {
  Body,
  Controller,
  Get,
  Post,
  HttpStatus,
  Put,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDTO } from 'src/dto/user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/create')
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

  @Put('/update/:id')
  async updateUser(@Body() createUserDTO: CreateUserDTO, @Param() params: any) {
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

  @Delete('/delete/:ids')
  async deleteUser(@Param('ids') ids: string) {
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

  @Get('/id/:id')
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
