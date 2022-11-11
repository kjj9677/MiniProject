import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Schedule } from './schedule.entity';
import { User } from './user.entity';

@Entity()
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Schedule, { primary: true })
  schedule: Schedule;

  @ManyToOne(() => User, { primary: true })
  member: User;
}
