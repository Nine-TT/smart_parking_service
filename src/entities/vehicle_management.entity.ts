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
import { ParkingLot } from './parking_lot.enity';
import { ParkingLocation } from './parking_location.enity';

@Entity('vehiclemanagement')
export class VehicleManagement {
  @PrimaryGeneratedColumn('increment')
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

  @Column({ nullable: true })
  floorId: number;

  @Column({ nullable: true })
  parkingLocationId: number;

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

  @ManyToOne(() => ParkingLot) // Đặt quan hệ Many-to-One với ParkingLot
  @JoinColumn({ name: 'parkingLotId' }) // Chọn trường liên kết với parkingLotId
  parkingLot: ParkingLot;

  @ManyToOne(() => ParkingLocation) // Đặt quan hệ Many-to-One với ParkingLocation
  @JoinColumn({ name: 'parkingLocationId' }) // Chọn trường liên kết với parkingLocationId
  parkingLocation: ParkingLocation;
}
