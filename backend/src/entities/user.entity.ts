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

  @Column({ nullable: true })
  kakaoId: string;

  @Column({ nullable: true })
  kakaoAccessToken: string;

  @CreateDateColumn()
  createdAt: Date;
}
