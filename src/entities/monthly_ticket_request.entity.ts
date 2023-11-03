import { Column, PrimaryGeneratedColumn, Entity } from 'typeorm';

@Entity('MonthlyTicketRequest')
export class MonthlyTicketRequest {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  userId: number;
}
