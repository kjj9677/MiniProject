import { Column, Entity, Generated, ManyToOne } from 'typeorm';
import { Plan } from './plan.entity';
import { Tag } from './tag.entity';

@Entity()
export class TagMapping {
  @Column()
  @Generated('increment')
  id: number;

  @ManyToOne(() => Plan, { primary: true })
  plan: Plan;

  @ManyToOne(() => Tag, { primary: true })
  tag: Tag;
}
