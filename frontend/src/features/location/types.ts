import { Status } from "../../store/status.enum";

export interface LocationState {
    items: Location[];
    status: Status;
    error: string | null;
}

export interface Location {
    _id: string;
    title: string;
    description: string;
    coordinates: {
        type: 'Point';
        coordinates: [number, number];
    };
    createdBy: string;
    visibility: 'public' | 'friends' | 'private';
    photos: string[];
    ratings: {
        user: string;
        rating: number;
    }[];
    comments: {
        user: string;
        text: string;
        createdAt: string;
        updatedAt?: string;
    }[];
    tags: string[];
    createdAt: string;
    updatedAt: string;
}