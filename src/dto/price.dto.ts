import { ApiProperty } from '@nestjs/swagger';

export class PriceDto {
  @ApiProperty()
  key: string;

  @ApiProperty()
  price: number;
}
