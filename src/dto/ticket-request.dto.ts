import { ApiProperty } from '@nestjs/swagger';

export class TicketRequestDTO {
  @ApiProperty()
  userId: number;

  @ApiProperty()
  licensePlates: string;
}

export class TicketRequestAcceptDTO {
  @ApiProperty()
  requestId: number;

  @ApiProperty()
  userId: number;

  @ApiProperty()
  licensePlates: string;

  @ApiProperty()
  cardId: string;

  @ApiProperty()
  registrationDate: Date;

  @ApiProperty()
  expirationDate: Date;
}
