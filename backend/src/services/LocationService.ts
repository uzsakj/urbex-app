import { Brackets, getRepository, Repository } from 'typeorm';
import { AppDataSource } from '../data-source.ts';
import { Location } from '../entities/Location.ts';
import { UserService } from './UserService.ts';

export class LocationService {
    private locationRepository: Repository<Location>;

    constructor(private userService: UserService) {

        this.locationRepository = AppDataSource.getRepository(Location);
    }


    public async getLocationById(id: string): Promise<Location | null> {
        return this.locationRepository.findOneBy({ id });
    }

    public async createLocation(locationData: Partial<Location>): Promise<void> {
        const location = this.locationRepository.create(locationData);
        await this.locationRepository.save(location);
    }

    public async updateLocation(locationData: Partial<Location>): Promise<void> {
        const location = await this.locationRepository.findOneBy({ id: locationData.id });

        if (!location) {
            throw new Error('Location not found');
        }

        this.locationRepository.merge(location, locationData);

        await this.locationRepository.save(location);
    }

    public async deleteById(id: string, userId: string): Promise<void> {
        const location = await this.locationRepository.findOneBy({ id });
        if (!location) {
            throw new Error('Location not found');
        }

        const createdBy = await location.createdBy
        if (createdBy.id !== userId) {
            throw new Error('Unauthorized to delete this location');
        }

        await this.locationRepository.delete({
            id,
            createdBy: { id: userId },
        });

    }

    public async getFilteredLocations(page: number, limit: number, userId: string): Promise<{ data: Location[]; total: number }> {
        const friendIds = await this.userService.getFriendsOfUser(userId);
        const offset = (page - 1) * limit;

        const query = this.locationRepository
            .createQueryBuilder('location')
            .leftJoinAndSelect('location.createdBy', 'creator')
            .where('location.visibility = :public', { public: 'public' })
            .orWhere('creator.id = :userId', { userId });

        if (friendIds.length > 0) {
            query.orWhere('location.visibility = :friends AND creator.id IN (:...friendIds)', {
                friends: 'friends',
                friendIds,
            });
        }

        const locations = await query
            .orderBy('location.createdAt', 'DESC')
            .skip(offset)
            .take(limit)
            .getMany();

        return { data: locations, total: locations.length };
    }
}

