import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne
} from 'typeorm';
import { User } from './User.ts';

export type NotificationType = 'friend_request' | 'friend_accept' | 'location_like' | 'comment';

@Entity()
export class Notification {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    recipient!: User;

    @ManyToOne(() => User, { nullable: true })
    sender?: User;

    @Column({ type: 'enum', enum: ['friend_request', 'friend_accept', 'location_like', 'comment'] })
    type!: NotificationType;

    @Column({ type: 'text', nullable: true })
    message?: string;

    @Column({ default: false })
    isRead!: boolean;

    @CreateDateColumn()
    createdAt!: Date;
}
