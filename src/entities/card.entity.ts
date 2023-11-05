import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { User } from './user.entity';
import { MonthlyTicket } from './monthly_ticket.entity';
import { Reevenue } from './revenue.entity';

@Entity('card')
export class Card {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  cardId: string;

  @Column()
  state: boolean;

  @Column()
  isMonthlyTicket: boolean;

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

  @OneToOne(() => MonthlyTicket, (monthlyTicket) => monthlyTicket.cardId, {
    cascade: true,
  })
  @JoinColumn()
  monthlyTicket: MonthlyTicket;

  @OneToMany(() => Reevenue, (reevenue) => reevenue.cardId, {
    cascade: ['insert', 'update', 'remove'],
  })
  reevenues: Reevenue[];
}
