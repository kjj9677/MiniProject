import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum USER_ROLE {
  ADMIN = 'admin',
  GUEST = 'guest',
}

@Entity()
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  roleName: USER_ROLE;

  @CreateDateColumn()
  createdAt: Date;
}
