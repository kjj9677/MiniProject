import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true }) // to be modified
  kakaoId: number;

  @CreateDateColumn()
  createdAt: Date;
}
