import {
  Entity,
  BaseEntity,
  Column,
  PrimaryGeneratedColumn,
  Index,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

import { Card } from './card.entity';

import { Exclude } from 'class-transformer';

@Entity({ name: 'user' })
@Index('idx_email', ['email'], { unique: true })
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  userName: string;

  @Column('varchar', {
    length: 15,
  })
  role: String;

  @Exclude()
  @Column()
  password: string;

  @Column()
  email: string;

  @Column()
  phoneNumber: string;

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

  @OneToMany(() => Card, (card) => card.user, { onDelete: 'CASCADE' })
  cards: Card[];
}
