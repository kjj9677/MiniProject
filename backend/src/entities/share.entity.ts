import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Plan } from './plan.entity';
import { User } from './user.entity';

@Entity()
export class Share {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Plan, { eager: true })
  plan: Plan;

  @ManyToOne(() => User, { eager: true })
  member: User;
}
