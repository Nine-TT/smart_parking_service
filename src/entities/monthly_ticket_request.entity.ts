import { Column, PrimaryGeneratedColumn, Entity } from 'typeorm';

@Entity('monthly_ticket_request')
export class MonthlyTicketRequest {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  userId: number;

  @Column()
  licensePlates: string;

  @Column()
  isAccept: boolean;
}
