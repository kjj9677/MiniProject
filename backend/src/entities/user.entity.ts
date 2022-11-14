import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Payment } from './payment.entity';
import { Role } from './role.entity';
import { Share } from './share.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  kakaoId: string;

  @Column({ nullable: true })
  kakaoAccessToken: string;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => Share, (share) => share.member, { eager: false })
  shares: Share[];

  @OneToMany(() => Payment, (payment) => payment.member, { eager: false })
  payments: Payment[];

  @ManyToOne(() => Role)
  role: Role;
}
