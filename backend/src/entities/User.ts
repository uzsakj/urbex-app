import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    BeforeInsert,
    BeforeUpdate,
    OneToMany,
    OneToOne,
} from 'typeorm';
import * as crypto from 'crypto';
import { Location } from './Location.ts';
import { Rating } from './Rating.ts';
import { Comment } from './Comment.ts';
import { Profile } from './Profile.ts';
import { Friendship } from './Friendship.ts';

export type Visibility = 'public' | 'private' | 'friends';

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', unique: true })
    username: string;

    @Column({ type: 'varchar', unique: true })
    email: string;

    @Column({ type: 'enum', enum: ['public', 'private', 'friends'], default: 'friends' })
    friendListVisibility: Visibility;

    @Column({ type: 'enum', enum: ['public', 'private', 'friends'], default: 'friends' })
    locationListVisibility: Visibility;

    @Column()
    passwordHash: string;

    @Column()
    passwordSalt: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @OneToMany(() => Location, location => location.user)
    locations: Location[];

    @OneToMany(() => Comment, comment => comment.user)
    comments: Comment[];

    @OneToMany(() => Rating, rating => rating.user)
    ratings: Rating[];

    @OneToOne(() => Profile, profile => profile.user)
    profile: Profile;

    @OneToMany(() => Friendship, f => f.requester)
    sentFriendRequests!: Friendship[];

    @OneToMany(() => Friendship, f => f.recipient)
    receivedFriendRequests!: Friendship[];


    setPassword(password: string) {
        this.passwordSalt = crypto.randomBytes(16).toString('hex');
        this.passwordHash = crypto
            .pbkdf2Sync(password, this.passwordSalt, 1000, 64, 'sha512')
            .toString('hex');
    }

    validatePassword(password: string): boolean {
        const hash = crypto
            .pbkdf2Sync(password, this.passwordSalt, 1000, 64, 'sha512')
            .toString('hex');
        return this.passwordHash === hash;
    }
}
