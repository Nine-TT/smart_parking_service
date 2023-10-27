import { Controller, Post, Body, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDTO } from 'src/dto/user.dto';
import { LoginDTO } from 'src/dto/user.dto';
import { ApiTags, ApiBody } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  @ApiBody({ type: CreateUserDTO })
  async register(@Body() createUSerDTO: CreateUserDTO) {
    try {
      const response = await this.authService.signIn(createUSerDTO);

      if (response === 1) {
        return {
          statusCode: HttpStatus.CONFLICT,
          message: 'Email or UserName already exist!',
          access_token: null,
        };
      }

      return {
        statusCode: HttpStatus.OK,
        message: 'Register successful!',
        access_token: `Bearer ${response}`,
      };
    } catch (error) {
      throw error;
    }
  }

  @Post('/login')
  @ApiBody({ type: LoginDTO })
  async login(@Body() loginDTO: LoginDTO) {
    try {
      let response = await this.authService.login(loginDTO);

      if (response === 1) {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'User not found or UserName || Email wrong!',
        };
      } else if (response === 0) {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Password wrong!',
        };
      } else {
        return {
          statusCode: HttpStatus.OK,
          message: 'Login successful!',
          access_token: `Bearer ${response}`,
        };
      }
    } catch (error) {
      throw error;
    }
  }
}
