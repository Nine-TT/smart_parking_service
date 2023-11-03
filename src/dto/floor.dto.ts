import { ApiProperty } from '@nestjs/swagger';

export class FloorDTO {
  @ApiProperty()
  name: string;

  @ApiProperty()
  quantity: number;

  @ApiProperty()
  row: number;

  @ApiProperty()
  parkingLotId: number;
}
