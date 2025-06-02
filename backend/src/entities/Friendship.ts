import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, Unique } from 'typeorm';
import { User } from './User.ts';

export type FriendshipStatus = 'pending' | 'accepted' | 'rejected' | 'blocked';

@Entity()
@Unique(['requester', 'recipient'])
export class Friendship {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @ManyToOne(() => User, user => user.sentFriendRequests, { onDelete: 'CASCADE' })
    requester!: User;

    @ManyToOne(() => User, user => user.receivedFriendRequests, { onDelete: 'CASCADE' })
    recipient!: User;

    @Column({ type: 'enum', enum: ['pending', 'accepted', 'rejected', 'blocked'], default: 'pending' })
    status!: FriendshipStatus;

    @CreateDateColumn()
    createdAt!: Date;
}
