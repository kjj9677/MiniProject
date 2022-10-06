import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Schedule {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  startTime: number; // To be modified

  @Column()
  duration: number;

  @Column()
  title: string;

  @Column()
  description: string; // Nullable

  @Column()
  planId: number; // FK

  @Column()
  scheduleTypeId: number; // FK

  @Column()
  createdBy: number; // FK
}
