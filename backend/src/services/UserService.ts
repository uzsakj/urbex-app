import { Repository } from 'typeorm';
import { Friendship } from '../entities/Friendship.ts';
import { User } from '../entities/User.ts';
import { AppDataSource } from '../data-source.ts';

export class UserService {
    private userRepository: Repository<User>;
    private friendshipRepository: Repository<Friendship>;

    constructor() {
        this.userRepository = AppDataSource.getRepository(User);
        this.friendshipRepository = AppDataSource.getRepository(Friendship);
    }
    public async getUserById(userId: string): Promise<User | null> {
        return this.userRepository.findOneBy({ id: userId });
    }

    public async getUserByEmail(email: string): Promise<User | null> {
        return this.userRepository.findOneBy({ email });
    }

    public async getUserByUsername(username: string) {
        return this.userRepository.findOneBy({ username });
    }

    public async getFriendsOfUser(userId: string): Promise<string[]> {
        const friendships = await this.friendshipRepository.find({
            where: [
                { requester: { id: userId }, status: 'accepted' },
                { recipient: { id: userId }, status: 'accepted' },
            ],
            relations: ['requester', 'recipient'],
        });

        return friendships.map(f =>
            f.requester.id === userId ? f.recipient.id : f.requester.id
        );
    }

    public async registerUser(data: { username: string; email: string; password: string }): Promise<User> {
        const user = this.userRepository.create({
            username: data.username,
            email: data.email,
            createdAt: new Date(),
        });

        user.setPassword(data.password);

        return await this.userRepository.save(user);
    }

    public async searchUsers(query: string) {
        const repo = AppDataSource.getRepository(User);

        return repo.createQueryBuilder('user')
            .leftJoinAndSelect('user.profile', 'profile')
            .where('LOWER(profile.fullName) LIKE :query', { query: `%${query.toLowerCase()}%` })
            .select([
                'user.id',
                'profile.fullName',
                'profile.avatarUrl',
            ])
            .getMany();
    }
};

