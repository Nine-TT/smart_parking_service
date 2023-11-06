import {
  Column,
  PrimaryGeneratedColumn,
  Entity,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

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

  @OneToOne(() => User)
  @JoinColumn({ name: 'userId' }) // Liên kết theo trường userId
  user: User;
}
