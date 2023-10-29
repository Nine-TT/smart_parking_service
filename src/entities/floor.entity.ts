import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
  UpdateDateColumn,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { ParkingLot } from './parking_lot.enity';
import { ParkingLocation } from './parking_location.enity';

@Entity('floor')
export class Floor {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  name: string;

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

  @ManyToOne(() => ParkingLot, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'parkingLot' })
  parkingLot: ParkingLot;

  @OneToMany(() => ParkingLocation, (location) => location.floor, {
    onDelete: 'CASCADE',
  })
  locations: ParkingLocation[];
}
