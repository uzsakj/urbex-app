import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Profile } from './types';
import { getProfile, updateProfile } from './profileAPI';
import { Status } from '../../store/status.enum';

interface ProfileState {
    data: Profile | null;
    status: Status;
    error: string | null;
}

const initialState: ProfileState = {
    data: null,
    status: Status.IDLE,
    error: null,
};

export const fetchProfile = createAsyncThunk<Profile, void, { rejectValue: string }>(
    'profile/fetch',
    async (_, thunkAPI) => {
        try {
            return await getProfile();
        } catch (err) {
            return thunkAPI.rejectWithValue(err.message || 'Failed to load profile');
        }
    }
);

export const saveProfile = createAsyncThunk<void, Partial<Profile>, { rejectValue: string }>(
    'profile/update',
    async (profileData, thunkAPI) => {
        try {
            return await updateProfile(profileData);
        } catch (err) {
            return thunkAPI.rejectWithValue(err.message || 'Failed to update profile');
        }
    }
);

const profileSlice = createSlice({
    name: 'profile',
    initialState,
    reducers: {
        clearProfile(state) {
            state.data = null;
            state.status = Status.IDLE;
            state.error = null;
        },
    },
    extraReducers: builder => {
        builder
            .addCase(fetchProfile.pending, state => {
                state.status = Status.LOADING;
                state.error = null;
            })
            .addCase(fetchProfile.fulfilled, (state, action: PayloadAction<Profile>) => {
                state.status = Status.SUCCEEDED;
                state.data = action.payload;
            })
            .addCase(fetchProfile.rejected, (state, action) => {
                state.status = Status.FAILED;
                state.error = action.payload || 'Could not fetch profile';
            })
            .addCase(saveProfile.pending, state => {
                state.status = Status.LOADING;
                state.error = null;
            })
            .addCase(saveProfile.fulfilled, (state) => {
                state.status = Status.SUCCEEDED;
            })
            .addCase(saveProfile.rejected, (state, action) => {
                state.status = Status.FAILED;
                state.error = action.payload || 'Could not update profile';
            });
    },
});

export const { clearProfile } = profileSlice.actions;
export default profileSlice.reducer;
