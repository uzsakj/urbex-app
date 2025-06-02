import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from "typeorm";
import { User } from "./User.ts";
import { Location } from "./Location.ts";

@Entity()
export class Rating {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => User, user => user.ratings, { eager: true })
    user: Promise<User>;

    @Column({ type: 'int', width: 1 })
    rating: number;

    @ManyToOne(() => Location, location => location.ratings)
    location: Promise<Location>;
}
