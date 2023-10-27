import { IsString, IsEmail, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class CreateUserDTO {
  @ApiProperty()
  @IsString()
  readonly firstName: string;

  @ApiProperty()
  @IsString()
  readonly lastName: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  readonly userName: string;

  @ApiProperty()
  @IsOptional()
  readonly password: string;

  @IsOptional()
  readonly role: string;

  @ApiProperty()
  @IsEmail()
  @IsOptional()
  readonly email: string;

  @ApiProperty()
  @IsString()
  readonly phoneNumber: string;
}

export class LoginDTO {
  @IsString()
  @IsOptional() // Đánh dấu trường này là không bắt buộc
  readonly userName?: string;

  @IsEmail()
  @IsOptional() // Đánh dấu trường này là không bắt buộc
  readonly email?: string;

  @IsString()
  readonly password: string;
}
