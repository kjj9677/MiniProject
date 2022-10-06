import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Schedule } from './schedule.entity';

@Entity()
export class Plan {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  destination: string;

  @Column()
  period: number;

  @Column()
  title: string;

  @Column()
  createdBy: number; // FK

  @OneToMany(() => Schedule, (schedule) => schedule.plan, { eager: false })
  schedules: Schedule[];
}
