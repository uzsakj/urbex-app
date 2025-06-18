import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { SearchState } from './types';
import * as api from './searchAPI.ts'
import { Status } from '../../store/status.enum.ts';



const initialState: SearchState = {
    userResults: [],
    locationResults: [],
    status: Status.IDLE,
    error: null,
};

export const fetchUserResults = createAsyncThunk(
    'search/fetchUserResults',
    async (query: string, { rejectWithValue }) => {
        try {
            return await api.searchUsers(query);
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to search users');
        }
    }
);

export const fetchLocationResults = createAsyncThunk(
    'search/fetchLocationResults',
    async (query: string, { rejectWithValue }) => {
        try {
            return await api.searchLocations(query);
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to search locations');
        }
    }
);

const searchSlice = createSlice({
    name: 'search',
    initialState,
    reducers: {
        clearResults(state) {
            state.userResults = [];
            state.locationResults = [];
            state.status = Status.IDLE;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUserResults.pending, (state) => {
                state.status = Status.LOADING;
                state.error = null;
            })
            .addCase(fetchUserResults.fulfilled, (state, action) => {
                state.status = Status.SUCCEEDED;
                state.userResults = action.payload.data;
            })
            .addCase(fetchUserResults.rejected, (state, action) => {
                state.status = Status.FAILED;
                state.error = action.payload as string;
            })
            .addCase(fetchLocationResults.pending, (state) => {
                state.status = Status.LOADING;
                state.error = null;
            })
            .addCase(fetchLocationResults.fulfilled, (state, action) => {
                state.status = Status.SUCCEEDED;
                state.locationResults = action.payload.data;
            })
            .addCase(fetchLocationResults.rejected, (state, action) => {
                state.status = Status.FAILED;
                state.error = action.payload as string;
            });
    },
});

export const { clearResults } = searchSlice.actions;
export default searchSlice.reducer;
