import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Plan } from './plan.entity';
import { ScheduleType } from './scheduleType.entity';
import { User } from './user.entity';

@Entity()
export class Schedule {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  startTime: number;

  @Column()
  duration: number;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @ManyToOne(() => Plan, (plan) => plan.schedules, { eager: false })
  @JoinColumn()
  plan: Plan;

  @ManyToOne(() => ScheduleType, {
    eager: true,
  })
  @JoinColumn()
  scheduleType: ScheduleType;

  @ManyToOne(() => User, { eager: false })
  @JoinColumn()
  createdBy: User;
}
