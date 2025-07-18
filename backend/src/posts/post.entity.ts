import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from '../users/user.entity';

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ type: 'text' })
  body: string;

  @CreateDateColumn()
  publishedAt: Date;

  @ManyToOne(() => User, (user) => user.posts, {eager: true})
  author: User;
}
