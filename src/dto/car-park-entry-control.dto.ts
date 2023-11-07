import { ApiProperty } from '@nestjs/swagger';

export class SwipeIn {
  @ApiProperty()
  timeIn: Date;

  @ApiProperty()
  folderName: string;

  @ApiProperty()
  licensePlates: string;

  @ApiProperty()
  cardId: string;

  @ApiProperty()
  parkingLotId: number;
}

export class ParkedDTO {
  @ApiProperty()
  licensePlates: string;

  @ApiProperty()
  parkingLocationId: number;
}

export class VehicleOut {
  @ApiProperty()
  cardId: string;

  @ApiProperty()
  timeOut: Date;

  @ApiProperty()
  licensePlates: string;
}
