import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Card } from './card.entity';

@Entity('vehiclemanagement')
export class VehicleManagement {
  @PrimaryColumn({ type: 'uuid' })
  id: string;

  @ManyToOne(() => Card, { cascade: ['remove'] })
  @JoinColumn({ name: 'card', referencedColumnName: 'id' })
  card: string;

  @Column()
  timeIn: Date;

  @Column()
  timeOut: Date;

  @Column()
  licensePlates: string;

  @Column()
  parkingFee: number;

  @Column()
  state: string;
}
