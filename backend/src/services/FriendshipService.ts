import { Repository } from 'typeorm';
import { AppDataSource } from '../data-source.ts';
import { Friendship, FriendshipStatus } from '../entities/Friendship.ts';
import { UserService } from './UserService.ts';
import { NotificationService } from './NotificationService.ts';
import { ProfileService } from './ProfileService.ts';

export class FriendshipService {
    private friendshipRepository: Repository<Friendship>;

    constructor(
        private userService: UserService,
        private notificationService: NotificationService,
        private profileService: ProfileService,

    ) {
        this.friendshipRepository = AppDataSource.getRepository(Friendship);
    }

    public async sendFriendRequest(requesterId: string, recipientId: string): Promise<Friendship> {
        if (requesterId === recipientId) throw new Error("You can't send a friend request to yourself");

        const requester = await this.userService.getUserById(requesterId);
        const recipient = await this.userService.getUserById(recipientId);

        if (!requester || !recipient) throw new Error("Requester or recipient not found");

        const existing = await this.friendshipRepository.findOne({
            where: [
                { requester: { id: requesterId }, recipient: { id: recipientId } },
                { requester: { id: recipientId }, recipient: { id: requesterId } }
            ]
        });
        if (existing) throw new Error("Friend request already exists");

        const friendship = this.friendshipRepository.create({
            requester,
            recipient,
            status: 'pending',
        });

        const savedFriendship = await this.friendshipRepository.save(friendship);

        const requesterProfile = await this.profileService.getProfileByUserId(requester.id)
        await this.notificationService.createNotification({
            recipient,
            sender: requester,
            type: 'friend_request',
            message: `${requesterProfile?.fullName || requester.username} sent you a friend request.`
        });

        return savedFriendship;
    }

    public async respondToRequest(id: string, status: FriendshipStatus): Promise<Friendship> {
        const friendship = await this.friendshipRepository.findOneBy({ id });
        if (!friendship) throw new Error("Friend request not found");

        friendship.status = status;
        const savedFriendship = await this.friendshipRepository.save(friendship);

        await this.notificationService.createNotification({
            recipient: savedFriendship.requester,
            sender: savedFriendship.recipient,
            type: 'friend_accept',
            message: `${savedFriendship.recipient.profile.fullName} has accepted your friend request.`
        });

        return savedFriendship;
    }

    public async getFriendsOfUser(userId: string, requesterId: string) {
        const friendships = await this.friendshipRepository.find({
            where: [
                { requester: { id: userId }, status: 'accepted' },
                { recipient: { id: userId }, status: 'accepted' },
            ],
            relations: ['requester', 'requester.profile', 'recipient', 'recipient.profile'],
        });

        const result = [];

        for (const friendship of friendships) {
            const isRequester = friendship.requester.id === userId;
            const friendUser = isRequester ? friendship.recipient : friendship.requester;
            const friendProfile = friendUser.profile;

            const visibility = friendUser.friendListVisibility || 'public';
            const isSelf = requesterId === friendUser.id;

            let canSee = false;

            if (visibility === 'public') {
                canSee = true;
            } else if (visibility === 'friends') {
                canSee = await this.areUsersFriends(friendUser.id, requesterId);
            } else if (visibility === 'private') {
                canSee = isSelf;
            }

            if (canSee && friendProfile) {
                result.push({
                    id: friendship.id,
                    status: friendship.status,
                    createdAt: friendship.createdAt,
                    friend: {
                        id: friendUser.id,
                        fullName: friendProfile.fullName,
                        avatarUrl: friendProfile.avatarUrl,
                        biography: friendProfile.biography,
                        country: friendProfile.country,
                        city: friendProfile.city,
                        gender: friendProfile.gender,
                        birthDate: friendProfile.birthDate,
                    },
                });
            }
        }

        return result;
    }



    public async areUsersFriends(userId1: string, userId2: string): Promise<boolean> {
        const friendship = await this.friendshipRepository.findOne({
            where: [
                { requester: { id: userId1 }, recipient: { id: userId2 }, status: 'accepted' },
                { requester: { id: userId2 }, recipient: { id: userId1 }, status: 'accepted' },
            ],
            relations: ['requester', 'recipient'],
        });

        return !!friendship;
    }

    public async getFriendship(friendshipId: string): Promise<Friendship | null> {
        return this.friendshipRepository.findOneBy({ id: friendshipId })

    }

    public async deleteFriendship(friendshipId: string) {

        const friendship = await this.friendshipRepository.findOneBy({ id: friendshipId })

        if (!friendship) throw new Error("Friendship not found")

        this.friendshipRepository.delete(friendship)

    }
}
