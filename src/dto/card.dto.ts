import { IsDate, IsOptional, isNotEmpty, isDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CardDto {
  @ApiProperty()
  cardId: string[];
}

export class UpdateCardDTO {
  @ApiProperty()
  @IsOptional()
  cardId: string;

  @ApiProperty()
  @IsOptional()
  state: boolean;

  @ApiProperty()
  @IsOptional()
  isMonthlyTicket: boolean;
}
