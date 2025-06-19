import React from 'react'
import Header from './Header'
import { Alert, Box, Snackbar, Toolbar } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../store'
import { hideSnackbar } from '../features/ui/uiSlice'

interface LayoutProps {
    children: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const dispatch = useDispatch();
    const snackbar = useSelector((state: RootState) => state.ui.snackbar);

    return (
        <>
            <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>

                <Header />
                <Toolbar />
                <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
                    <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', width: '100%' }}>
                        {children}
                    </Box>
                </Box>
            </Box>
            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={() => dispatch(hideSnackbar())}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert severity={snackbar.severity} onClose={() => dispatch(hideSnackbar())}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </>
    )
}

export default Layout