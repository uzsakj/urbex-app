import { Repository } from 'typeorm';
import { AppDataSource } from '../data-source.ts';
import { Notification } from '../entities/Notification.ts';

export class NotificationService {
    private notificationRepository: Repository<Notification>;

    constructor() {
        this.notificationRepository = AppDataSource.getRepository(Notification);
    }


    public async createNotification(data: Partial<Notification>): Promise<Notification> {
        const notification = this.notificationRepository.create({
            recipient: data.recipient,
            sender: data.sender ? data.sender : undefined,
            type: data.type,
            message: data.message,
            isRead: false
        });

        return this.notificationRepository.save(notification);
    }

    public async getNotificationsForUser(userId: string, unreadOnly = false): Promise<Notification[]> {
        const query = this.notificationRepository.createQueryBuilder('notification')
            .leftJoinAndSelect('notification.sender', 'sender')
            .where('notification.recipient.id = :userId', { userId });

        if (unreadOnly) {
            query.andWhere('notification.isRead = false');
        }

        return await query.orderBy('notification.createdAt', 'DESC').getMany();
    }

    public async markAsRead(notificationId: string, userId: string): Promise<void> {
        const notification = await this.notificationRepository.findOne({
            where: { id: notificationId },
            relations: ['recipient'],
        });

        if (!notification) throw new Error('Notification not found');

        const recipient = await notification.recipient
        if (recipient.id !== userId) throw new Error('Notification unauthorized');


        notification.isRead = true;
        await this.notificationRepository.save(notification);
    }

    public async deleteNotification(notificationId: string, userId: string): Promise<void> {
        const notification = await this.notificationRepository.findOne({
            where: { id: notificationId },
            relations: ['recipient'],
        });

        if (!notification) throw new Error('Notification not found');

        const recipient = await notification.recipient
        if (recipient.id !== userId) throw new Error('Notification unauthorized');

        await this.notificationRepository.remove(notification);
    }
}
