export interface ILocation {
    _id: string;
    title: string;
    description: string;
    coordinates: {
        type: 'Point';
        coordinates: [number, number]; // [lng, lat]
    };
    createdBy: string; // ObjectId as string
    visibility: 'public' | 'friends' | 'private';
    photos: string[];
    ratings: {
        user: string; // ObjectId as string
        rating: number;
    }[];
    comments: {
        user: string; // ObjectId as string
        text: string;
        createdAt: string; // Dates are usually strings in JSON
        updatedAt?: string;
    }[];
    tags: string[];
    createdAt: string;
    updatedAt: string;
}
