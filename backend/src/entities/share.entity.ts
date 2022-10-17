import { Column, Entity, Generated, ManyToOne } from 'typeorm';
import { Plan } from './plan.entity';
import { User } from './user.entity';

@Entity()
export class Share {
  @Column()
  @Generated('increment')
  id: number;

  @ManyToOne(() => Plan, { eager: true, primary: true })
  plan: Plan;

  @ManyToOne(() => User, { eager: true, primary: true })
  member: User;
}
