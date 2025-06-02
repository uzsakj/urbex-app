import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { User } from "./User.ts";
import { Location } from "./Location.ts";

@Entity()
export class Comment {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => User, user => user.comments, { eager: true })
    user: Promise<User>;

    @Column('text')
    text: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn({ nullable: true })
    updatedAt: Date;

    @ManyToOne(() => Location, location => location.comments)
    location: Promise<Location>;
}