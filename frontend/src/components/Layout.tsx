import React from 'react'
import Header from './Header'
import { Box, Toolbar } from '@mui/material'

interface LayoutProps {
    children: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
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
        </>
    )
}

export default Layout