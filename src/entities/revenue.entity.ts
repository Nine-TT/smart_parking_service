import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('reevenue')
export class Card {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  type: string;

  @Column()
  expense: number;

  @Column()
  date: Date;
}
