export type NotificationType = 'friend_request' | 'friend_accept' | 'location_like' | 'comment';

export interface Notification {
    id: string;
    type: NotificationType;
    message?: string;
    isRead: boolean;
    createdAt: string;
    recipient: {
        id: string;
    };
    sender?: {
        id: string;
        profile?: {
            fullName?: string;
            avatarUrl?: string;
        };
    };
}