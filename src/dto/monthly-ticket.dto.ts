import { ApiProperty } from '@nestjs/swagger';
export class MonthlyTicketDTO {
  @ApiProperty()
  licensePlates: string;

  @ApiProperty()
  cardId: string;

  @ApiProperty()
  registrationDate: Date;

  @ApiProperty()
  expirationDate: Date;
}

export class UpdateLicensePlates {
  @ApiProperty()
  ticketId: number;

  @ApiProperty()
  licensePlates: string;
}

export class ExtendMonthlyTicket {
  @ApiProperty()
  ticketId: number;

  @ApiProperty()
  registrationDate: Date;

  @ApiProperty()
  expirationDate: Date;
}
