import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from './user.ts';

export interface ILocation extends Document {
    title: string;
    description: string;
    coordinates: {
        type: 'Point';
        coordinates: [number, number];
    };
    createdBy: IUser['_id'];
    visibility: 'public' | 'friends';
    photos: string[];
    ratings: {
        user: IUser['_id'];
        rating: number;
    }[];
    comments: {
        user: IUser['_id'];
        text: string;
        createdAt: Date;
    }[];
    tags: string[];
    createdAt: Date;
    updatedAt: Date;
}

const locationSchema = new Schema<ILocation>({
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    coordinates: {
        type: { type: String, enum: ['Point'], required: true, default: 'Point' },
        coordinates: { type: [Number], required: true },
    },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    visibility: { type: String, enum: ['public', 'friends'], default: 'public' },
    photos: [{ type: String }],
    ratings: [{
        user: { type: Schema.Types.ObjectId, ref: 'User' },
        rating: { type: Number, min: 1, max: 5 },
    }],
    comments: [{
        user: { type: Schema.Types.ObjectId, ref: 'User' },
        text: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
    }],
    tags: [{ type: String, trim: true, lowercase: true }],
}, { timestamps: true });

locationSchema.index({ coordinates: '2dsphere' });

export default mongoose.model<ILocation>("Location", locationSchema);
