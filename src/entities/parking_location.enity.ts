import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  ManyToOne,
} from 'typeorm';

import { VehicleManagement } from './vehicle_management.entity';
import { ParkingLot } from './parking_lot.enity';

@Entity('parkinglocation')
export class ParkingLocation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  location: number;

  @Column()
  floor: number;

  @ManyToOne(() => ParkingLot)
  @JoinColumn({ name: 'parking_lot_id', referencedColumnName: 'id' })
  parking: number;

  @Column()
  state: string;

  @OneToOne(() => VehicleManagement)
  @JoinColumn({ name: 'id' })
  vehicle: VehicleManagement;
}
