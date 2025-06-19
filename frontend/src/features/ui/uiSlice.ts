import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SnackbarSeverity, UIState } from './types';



const initialState: UIState = {
    snackbar: {
        open: false,
        message: '',
        severity: SnackbarSeverity.INFO,
    },
};

const uiSlice = createSlice({
    name: 'ui',
    initialState,
    reducers: {
        showSnackbar: (
            state,
            action: PayloadAction<{ message: string; severity?: SnackbarSeverity }>
        ) => {
            state.snackbar.open = true;
            state.snackbar.message = action.payload.message;
            state.snackbar.severity = action.payload.severity || SnackbarSeverity.INFO;
        },
        hideSnackbar: (state) => {
            state.snackbar.open = false;
            state.snackbar.message = '';
        },
    },
});

export const { showSnackbar, hideSnackbar } = uiSlice.actions;
export default uiSlice.reducer;
