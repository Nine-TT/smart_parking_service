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
  @JoinColumn({ name: 'floorId' })
  @Column()
  floorId: number;

  @ManyToOne(() => ParkingLot)
  @JoinColumn({ name: 'parking' })
  parkinglot: number;

  @Column()
  location: number;

  @Column()
  state: String;

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

  @Column({ nullable: true })
  vehicleManagementId: string | null;

  @ManyToOne(() => VehicleManagement)
  @JoinColumn({ name: 'vehicleManagementId' })
  vehicleManagement: VehicleManagement;
}
