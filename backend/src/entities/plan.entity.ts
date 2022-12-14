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
import { Share } from './share.entity';
import { TagMapping } from './tagMapping.entity';
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

  @ManyToOne(() => User, { eager: true })
  @JoinColumn()
  createdBy: User;

  @OneToMany(() => Schedule, (schedule) => schedule.plan, { eager: false })
  @JoinColumn()
  schedules: Schedule[];

  @OneToMany(() => Share, (share) => share.plan, { eager: false })
  shares: Share[];

  @CreateDateColumn()
  createdAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @Column({ nullable: true })
  isPublic: boolean;

  @OneToMany(() => TagMapping, (tagMapping) => tagMapping.plan, {
    eager: false,
  })
  tagMappings: TagMapping[];
}
