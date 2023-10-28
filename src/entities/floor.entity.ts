import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { ParkingLot } from './parking_lot.enity';

@Entity('floor')
export class Floor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => ParkingLot, { cascade: ['remove'] })
  @JoinColumn({ name: 'parking_lot_id', referencedColumnName: 'id' })
  parkingLot: number;
}
