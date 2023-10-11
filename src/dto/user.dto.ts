import { IsString, IsEmail, IsOptional } from 'class-validator';

export class CreateUserDTO {
  @IsString()
  readonly firstName: string;

  @IsString()
  readonly lastName: string;

  @IsString()
  @IsOptional()
  readonly userName: string;

  @IsOptional()
  readonly password: string;

  @IsOptional()
  readonly role: string;

  @IsEmail()
  @IsOptional()
  readonly email: string;

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
