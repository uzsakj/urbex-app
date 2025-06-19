export enum SnackbarSeverity {
    SUCCESS = 'success',
    ERROR = 'error',
    WARNING = 'warning',
    INFO = 'info'

}

export interface SnackbarState {
    open: boolean;
    message: string;
    severity: SnackbarSeverity;
}



export interface UIState {
    snackbar: SnackbarState;
}