import { Status } from "../../store/status.enum";

export interface UserResult {
    id: string;
    type: 'user';
    profile: {
        fullName: string;
        avatarUrl?: string;
    }
}

export interface LocationResult {
    id: string;
    type: 'location';
    name: string;
    description?: string;
}

export interface SearchState {
    userResults: UserResult[];
    locationResults: LocationResult[];
    status: Status;
    error: string | null;
}

export type SearchResult = UserResult | LocationResult;