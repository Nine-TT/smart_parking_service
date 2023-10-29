import { IsString, IsEmail, IsOptional, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class CreateUserDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly firstName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly lastName: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  readonly userName: string;

  @ApiProperty()
  @IsOptional()
  @IsNotEmpty()
  readonly password: string;

  @IsOptional()
  readonly role?: string;

  @ApiProperty()
  @IsEmail()
  @IsOptional()
  @IsNotEmpty()
  readonly email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly phoneNumber: string;
}

export class LoginDTO {
  @IsString()
  @ApiProperty()
  @IsOptional()
  readonly userName?: string;

  @IsEmail()
  @ApiProperty()
  @IsOptional()
  readonly email?: string;

  @IsString()
  @ApiProperty()
  @IsNotEmpty()
  readonly password: string;
}
