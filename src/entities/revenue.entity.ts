import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

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

  @Column()
  parkingLotId: number;

  @Column()
  date: Date;

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
