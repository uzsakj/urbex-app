import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    OneToMany,
    CreateDateColumn,
    UpdateDateColumn,
    Index,
    OneToOne,
} from 'typeorm';
import { User } from './User.ts';
import { Rating } from './Rating.ts';
import { Comment } from './Comment.ts';

@Entity()
@Index(['coordinates'], { spatial: true })
@Index(['tags'])
@Index(['createdAt'])
export class Location {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', nullable: false, unique: false })
    name: string;

    @Column({ type: 'text', nullable: false })
    description: string;

    @Column({
        type: 'geometry',
        spatialFeatureType: 'Point',
        srid: 4326, // WGS 84
        nullable: false,
    })
    coordinates: string;

    @ManyToOne(() => User, user => user.locations, { eager: true })
    createdBy: Promise<User>;

    @Column({
        type: 'enum',
        enum: ['public', 'friends', 'private'],
        default: 'public',
    })
    visibility: 'public' | 'friends' | 'private';

    @Column("text", { array: true, default: [] })
    photos: string[];

    @OneToMany(() => Rating, rating => rating.location, { cascade: true })
    ratings: Rating[];

    @OneToMany(() => Comment, comment => comment.location, { cascade: true })
    comments: Comment[];

    @OneToOne(() => User, user => user.locations, { cascade: true })
    user: Promise<User>;

    @Column("text", { array: true, default: [] })
    tags: string[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}

