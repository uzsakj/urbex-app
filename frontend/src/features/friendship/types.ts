import { Status } from "../../store/status.enum";
import { Profile } from "../profile/types";

export type FriendshipStatus = 'pending' | 'accepted' | 'rejected' | 'blocked';

export interface Friendship {
    id: string;
    requester: { id: string; name: string };
    recipient: { id: string; name: string };
    status: FriendshipStatus;
    profile: Profile;
    createdAt: string;
}

export interface FriendshipState {
    friends: Friendship[];
    pendingRequests: Friendship[];
    status: Status;
    error: string | null;
}
