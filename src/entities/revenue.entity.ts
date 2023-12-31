import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Card } from './card.entity';

@Entity('reevenue')
export class Reevenue {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  cardId: string;

  @Column()
  type: string;

  @Column()
  expense: number;

  @Column({ nullable: true })
  parkingLotId: number;

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

  @ManyToOne(() => Card)
  @JoinColumn({ name: 'cardId' })
  card: Card;
}
