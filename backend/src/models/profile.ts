import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from './user.ts';

export interface IProfile extends Document {
    user: IUser['_id'];
    fullName: string;
    biography?: string;
    province?: string;
    avatarUrl?: string;
    createdAt: Date;
}

const profileSchema = new Schema<IProfile>({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    fullName: { type: String, required: true },
    biography: { type: String },
    province: { type: String },
    avatarUrl: { type: String },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IProfile>("Profile", profileSchema);
