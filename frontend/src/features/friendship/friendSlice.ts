import { Status } from "../../store/status.enum";
import * as api from './friendsAPI';
import { Friendship, FriendshipState, FriendshipStatus } from "./types";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: FriendshipState = {
    friends: [],
    pendingRequests: [],
    status: Status.IDLE,
    error: null
}

export const fetchFriends = createAsyncThunk<Friendship[], string>(
    'friendship/fetchFriends',
    async (userId) => {
        return await api.fetchFriendsOfUser(userId)
    });

export const requestFriend = createAsyncThunk<Friendship, string>(
    'friendship/requestFriend',
    async (recipientId) => {
        return await api.sendFriendRequest(recipientId)
    });

export const respondToRequest = createAsyncThunk<
    Friendship,
    { friendshipId: string; status: FriendshipStatus }
>('friendship/respondToRequest', async ({ friendshipId, status }) => {
    return await api.respondToFriendRequest(friendshipId, status);
});

export const removeFriendship = createAsyncThunk<string, string>(
    'friendship/removeFriendship',
    async (friendshipId) => {
        await api.deleteFriendship(friendshipId);
        return friendshipId;
    });


const friendshipSlice = createSlice({
    name: 'friendship',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchFriends.pending, (state) => {
                state.status = Status.LOADING
                state.error = null
            })
            .addCase(fetchFriends.fulfilled, (state, action: PayloadAction<Friendship[]>) => {
                state.status = Status.SUCCEEDED
                state.friends = action.payload
                state.error = null
            })
            .addCase(fetchFriends.rejected, (state, action) => {
                state.status = Status.FAILED
                state.error = action.error.message ?? 'Failed to fetch friends'
            })
            .addCase(requestFriend.fulfilled, (state, action: PayloadAction<Friendship>) => {
                if (action.payload.status === 'pending') {
                    state.pendingRequests.push(action.payload);
                }
            })
            .addCase(respondToRequest.fulfilled, (state, action: PayloadAction<Friendship>) => {
                const idx = state.friends.findIndex((f) => f.id === action.payload.id);
                if (idx !== -1) state.friends[idx] = action.payload;
            })
            .addCase(removeFriendship.fulfilled, (state, action: PayloadAction<string>) => {
                state.friends = state.friends.filter((f) => f.id !== action.payload);
            });
    }
})

export default friendshipSlice.reducer;