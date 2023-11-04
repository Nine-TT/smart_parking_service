import {
  Body,
  Controller,
  Get,
  Post,
  HttpStatus,
  Put,
  Param,
  Query,
  Delete,
  UseGuards,
  Patch,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import {
  ApiBody,
  ApiTags,
  ApiParam,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { UserService } from './user.service';
import { CreateUserDTO, UpdateAvatarDTO } from 'src/dto/user.dto';
import { RolesGuard } from 'src/middleware/roles.guard';
import { AuthGuard } from 'src/middleware/auth.guard';
import { Roles, userRole } from 'src/constants';
import { FileInterceptor } from '@nestjs/platform-express/multer';

@ApiTags('User')
// @ApiBearerAuth()
// @UseGuards(AuthGuard) // check token
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // @UseGuards(RolesGuard) // check role
  // @Roles(userRole.admin)
  @Post('/create')
  @ApiBody({ type: CreateUserDTO })
  async createUSer(@Body() createUSerDTO: CreateUserDTO) {
    try {
      const response = await this.userService.createUser(createUSerDTO);

      if (response === 1) {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
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
  @ApiBody({ type: CreateUserDTO })
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
  async deleteUser(@Param('ids') ids: string) {
    try {
      const idArray = ids.split(',').map((id) => parseInt(id, 10));

      const deletedCount = await this.userService.deleteUSerById(idArray);

      if (deletedCount != 0) {
        return {
          statusCode: HttpStatus.OK,
          count: deletedCount,
          message: 'Delete user successful!',
        };
      }
    } catch (error) {
      throw error;
    }
  }

  @Get('/:id')
  @ApiParam({ name: 'id', type: 'number' })
  async getUserById(@Param('id') id: number) {
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

  // @UseGuards(RolesGuard) // check role
  // @Roles(userRole.admin)
  @ApiParam({ name: 'page', type: Number })
  @ApiParam({ name: 'pageSize', type: Number })
  @Get('/all/:page/:pageSize')
  async getAllUsers(
    @Param('page') page: number,
    @Param('pageSize') pageSize: number,
  ) {
    try {
      const response = await this.userService.getUsersWithCount({
        page,
        pageSize,
      });

      return {
        statusCode: HttpStatus.OK,
        message: 'Get user successful!',
        count: response.count,
        Data: response.users,
      };
    } catch (error) {
      console.log('ERROR: ', error);
      throw error;
    }
  }

  @Patch('/avatar')
  @ApiBody({ type: UpdateAvatarDTO })
  @UseInterceptors(FileInterceptor('file'))
  async updateAvatar(
    @UploadedFile() file: Express.Multer.File,
    @Body() updateAvatarDTO: UpdateAvatarDTO,
  ) {
    try {
      const response = await this.userService.updateAvatar(
        file,
        updateAvatarDTO.folderName,
        updateAvatarDTO.userId,
      );

      if (response != 0) {
        return {
          statusCode: HttpStatus.OK,
          message: 'Upload avatar successfully!',
        };
      } else {
        return {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Upload avatar fail!',
        };
      }
    } catch (error) {
      throw error;
    }
  }
}
