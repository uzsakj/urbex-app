import { Repository } from 'typeorm';
import { Profile } from '../entities/Profile.ts';
import { AppDataSource } from '../data-source.ts';
import { uploadToCloudinary } from '../utils/cloudinary.ts';
import fs from 'fs';


export class ProfileService {
    private profileRepository: Repository<Profile>;

    constructor() {
        this.profileRepository = AppDataSource.getRepository(Profile);
    }

    public async getProfileByUserId(userId: string): Promise<Profile | null> {
        return this.profileRepository.findOneBy({ user: { id: userId } });
    }

    public async createOrUpdateProfile(data: Partial<Profile>, file?: Express.Multer.File): Promise<Profile> {
        const existingProfile = await this.profileRepository.findOneBy({ user: { id: (await data.user)?.id } });

        if (file) {
            try {
                const uploadResult = await uploadToCloudinary(file.path);
                data.avatarUrl = uploadResult.secure_url;
            } finally {
                fs.unlinkSync(file.path)
            }
        }

        if (existingProfile) {
            const updated = this.profileRepository.merge(existingProfile, data);
            return this.profileRepository.save(updated);
        }

        const profile = this.profileRepository.create(data);
        return this.profileRepository.save(profile);


    }

    public async deleteProfileByUserId(userId: string): Promise<void> {
        await this.profileRepository.delete({ user: { id: userId } });
    }

}
