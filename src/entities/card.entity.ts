import { Entity, Column, PrimaryColumn, OneToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('card')
export class Card {
  @PrimaryColumn({ type: 'uuid' })
  id: string;

  @Column()
  expirationDate: Date;

  @OneToOne(() => User)
  @JoinColumn({ name: 'id' })
  user: User;
}
