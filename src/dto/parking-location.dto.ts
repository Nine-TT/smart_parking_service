import { ApiProperty } from '@nestjs/swagger';

export class ParkingLocationDTO {
  @ApiProperty()
  listblocked?: number[];

  @ApiProperty()
  listRoad?: number[];

  @ApiProperty()
  listEmpty?: number[];

  @ApiProperty()
  floorId?: number;
}

export class AddNewParkingLocationDTO {
  @ApiProperty()
  floorId: number;

  @ApiProperty()
  quantity: number;
}
