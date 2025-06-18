import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToOne,
    JoinColumn,
    CreateDateColumn,
    UpdateDateColumn,
    Unique,
} from 'typeorm';
import { User } from './User.ts';

@Entity()
@Unique(['user'])
export class Profile {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @OneToOne(() => User, { eager: true })
    @JoinColumn()
    user: Promise<User>;

    @Column({ type: 'varchar', nullable: false })
    fullName: string;

    @Column({ type: 'text', nullable: true })
    biography?: string;

    @Column({ type: 'date', nullable: true })
    birthDate: Date

    @Column({ type: 'varchar', nullable: true })
    gender?: string

    @Column({ type: 'varchar', nullable: true })
    country: string

    @Column({ type: 'varchar', nullable: true })
    city: string

    @Column({ type: 'varchar', nullable: true })
    avatarUrl?: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;


}
