import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Share {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  planId: number; // FK

  @Column()
  userId: number; // FK
}
