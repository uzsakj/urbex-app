import mongoose, { Schema, Document, Types } from 'mongoose';

export interface ILocation extends Document {
    name: string;
    description: string;
    coordinates: {
        type: 'Point';
        coordinates: [number, number];
    };
    createdBy: Types.ObjectId;
    visibility: 'public' | 'friends' | 'private';
    photos: string[];
    ratings: {
        user: Types.ObjectId;
        rating: number;
    }[];
    comments: {
        user: Types.ObjectId;
        text: string;
        createdAt: Date;
        updatedAt?: Date;
    }[];
    tags: string[];
    createdAt: Date;
    updatedAt: Date;
}

const locationSchema = new Schema<ILocation>(
    {
        name: { type: String, required: true, trim: true },
        description: { type: String, required: true, trim: true },
        coordinates: {
            type: {
                type: String,
                enum: ['Point'],
                required: true,
                default: 'Point',
            },
            coordinates: {
                type: [Number],
                required: true,
                validate: {
                    validator: (arr: number[]) => arr.length === 2,
                    message: 'Coordinates must be a [longitude, latitude] array',
                },
            },
        },
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },
        visibility: {
            type: String,
            enum: ['public', 'friends', 'private'],
            default: 'public',
        },
        photos: [{ type: String }],
        ratings: [
            {
                user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
                rating: { type: Number, min: 1, max: 5, required: true },
            },
        ],
        comments: [
            {
                user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
                text: { type: String, required: true },
                createdAt: { type: Date, default: Date.now },
                updatedAt: { type: Date },
            },
        ],
        tags: [{ type: String, trim: true, lowercase: true }],
    },
    {
        timestamps: true,
    }
);

locationSchema.index({ coordinates: '2dsphere' });
locationSchema.index({ tags: 1 });
locationSchema.index({ createdAt: -1 });

export default mongoose.model<ILocation>('Location', locationSchema);
