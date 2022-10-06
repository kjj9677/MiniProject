import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Plan } from './plan.entity';
import { ScheduleType } from './scheduleType.entity';

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

  @ManyToOne(() => Plan, (plan) => plan.schedules, { eager: true })
  @JoinColumn()
  plan: Plan;

  @ManyToOne(() => ScheduleType, {
    eager: true,
  })
  @JoinColumn()
  scheduleType: ScheduleType;

  @Column()
  createdBy: number; // FK
}
