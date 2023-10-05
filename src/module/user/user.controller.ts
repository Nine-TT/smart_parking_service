import { Controller, Get } from '@nestjs/common';
import { UserService } from './user.service';
import { responseData } from 'src/globalClass/ResponseData';
import { httpMessage, httpStatus } from 'src/globalClass/enumClass';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/user')
  async getProducts(): Promise<responseData<string>> {
    try {
      return new responseData<string>(
        await this.userService.getUsers(),
        httpStatus.SUCCESS,
        httpMessage.SUCCESS,
      );
    } catch (error) {
      throw error;
    }
  }
}
