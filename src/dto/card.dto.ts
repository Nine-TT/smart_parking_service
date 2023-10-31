import { IsDate, IsOptional, isNotEmpty, isDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CardDto {
  @ApiProperty()
  expirationDate: Date;

  @ApiProperty()
  @ApiPropertyOptional()
  @IsOptional()
  userId?: number;
}
