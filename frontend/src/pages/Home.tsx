import React from 'react';
import { Button, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Dashboard from './Dashboard.tsx';
import { useSelector } from 'react-redux';
import { RootState } from '../store/index.ts';
import { Status } from '../store/status.enum.ts';

const Home: React.FC = () => {
    const navigate = useNavigate();
    const status = useSelector((state: RootState) => state.auth.status)

    const goToLogin = () => {
        navigate('/login');
    };

    const goToRegister = () => {
        navigate('/register');
    };


    return (
        <Box
            sx={{
                width: '100vw',
                height: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
                textAlign: 'center',
                position: 'relative',
                backgroundImage: 'url(/urbex.jpg)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                overflow: 'hidden',

            }}
        >
            {status === Status.SUCCEEDED ? (

                <Dashboard />
            ) : (
                <Box
                    sx={{
                        backgroundColor: 'rgba(255, 254, 254, 1)',
                        padding: '20px',
                        borderRadius: '8px',
                        textShadow: '2px 2px 4px rgba(0, 0, 0, 0.4)',
                    }}
                >
                    <Typography variant="h4" gutterBottom>
                        Welcome to UrbexHub
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                        Please log in or sign up to continue.
                    </Typography>

                    <Button
                        variant="contained"
                        sx={{ mt: 2, width: '100%', backgroundColor: '#757575' }}
                        onClick={goToLogin}
                    >
                        Log in
                    </Button>

                    <Button
                        variant="contained"
                        sx={{ mt: 2, width: '100%', backgroundColor: '#03a9f4' }}
                        onClick={goToRegister}
                    >
                        Sign Up
                    </Button>
                </Box>
            )}
        </Box>
    );
};

export default Home;
