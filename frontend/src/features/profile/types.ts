import { Status } from "../../store/status.enum";

export interface Profile {
    fullName?: string;
    biography?: string;
    country?: string;
    city?: string;
    gender?: string;
    birthDate?: string;
    avatarUrl?: string;
};
export interface ProfileState {
    data: Profile | null;
    status: Status;
    error: string | null;
}