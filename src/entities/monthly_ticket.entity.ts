import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('monthly_ticket')
export class MonthlyTicket {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  cardId: string;

  @Column({ nullable: true })
  userId: number;

  @Column()
  licensePlates: string;

  @Column()
  RegistrationDate: Date;

  @Column()
  expirationDate: Date;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  updated_at: Date;
}
