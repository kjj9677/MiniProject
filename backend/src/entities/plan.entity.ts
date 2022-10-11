import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Schedule } from './schedule.entity';
import { User } from './user.entity';

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

  @ManyToOne(() => User, { eager: false })
  @JoinColumn()
  createdBy: User;

  @OneToMany(() => Schedule, (schedule) => schedule.createdBy, { eager: false })
  @JoinColumn()
  schedules: Schedule[];

  @CreateDateColumn()
  createdAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
