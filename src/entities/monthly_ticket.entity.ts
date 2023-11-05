import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  OneToOne,
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

  @Column({ type: 'date' })
  registrationDate: Date;

  @Column({ type: 'date' })
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

  @OneToOne(() => User, (user) => user.id, {
    cascade: true, // Thêm CASCADE DELETE vào mối quan hệ
  })
  @JoinColumn()
  user: User;
}
