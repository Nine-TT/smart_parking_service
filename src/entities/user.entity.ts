import {
  Entity,
  BaseEntity,
  Column,
  PrimaryGeneratedColumn,
  Index,
} from 'typeorm';

import { Exclude, Expose } from 'class-transformer';

@Entity({ name: 'user' })
@Index('idx_email', ['email'], { unique: true })
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
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
}
