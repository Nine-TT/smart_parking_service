import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Card } from './card.entity';

@Entity('vehiclemanagement')
export class VehicleManagement {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Card, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'card' })
  card: Card;

  @Column({ type: 'datetime' })
  timeIn: Date;

  @Column({ type: 'datetime', nullable: true })
  timeOut: Date;

  @Column()
  licensePlates: string;

  @Column()
  licensePlatesImageUrl: string;

  @Column({ type: 'int', nullable: true })
  parkingFee: number;

  @Column()
  state: string;

  @Column()
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
}
