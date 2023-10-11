import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('card')
export class Card {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  expirationDate: Date;

  @OneToOne(() => User)
  @JoinColumn({ name: 'id' })
  user: User;
}
