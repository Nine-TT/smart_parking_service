import { Column, PrimaryGeneratedColumn } from 'typeorm';

export class MonthlyTicketRequest {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  userId: number;
}
