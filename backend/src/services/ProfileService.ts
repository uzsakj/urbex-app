import { Repository } from 'typeorm';
import { Profile } from '../entities/Profile.ts';
import { AppDataSource } from '../data-source.ts';

export class ProfileService {
    private profileRepository: Repository<Profile>;

    constructor() {
        this.profileRepository = AppDataSource.getRepository(Profile);
    }

    public async getProfileByUserId(userId: string): Promise<Profile | null> {
        return this.profileRepository.findOneBy({ user: { id: userId } });
    }

    public async createOrUpdateProfile(data: Partial<Profile>): Promise<Profile> {
        const profile = this.profileRepository.create(data);
        return this.profileRepository.save(profile);
    }

    public async deleteProfileByUserId(userId: string): Promise<void> {
        await this.profileRepository.delete({ user: { id: userId } });
    }

}
