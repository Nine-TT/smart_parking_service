import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import { VehicleManagement } from './vehicle_management.entity';
import { ParkingLot } from './parking_lot.enity';
import { Floor } from './floor.entity';

@Entity('parkinglocation')
export class ParkingLocation {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(() => Floor)
  @JoinColumn({ name: 'floor' })
  floor: Floor;

  @ManyToOne(() => ParkingLot)
  @JoinColumn({ name: 'parking' })
  parking: ParkingLot;

  @Column()
  location: number;

  @Column()
  state: string;

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

  @Column()
  vehicle: string;

  @ManyToOne(() => VehicleManagement)
  @JoinColumn({ name: 'vehicle' })
  vehicleManagement: VehicleManagement;
}
