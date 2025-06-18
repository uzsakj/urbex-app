import React from 'react';
import { Button, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Home: React.FC = () => {
    const navigate = useNavigate();

    const goToLogin = () => {
        navigate('/login');
    };

    const goToRegister = () => {
        navigate('/register');
    };



    return (
        <Box
            sx={{
                flexGrow: 1,
                minHeight: '100vh',
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                backgroundImage: 'url(/urbex.jpg)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                justifyContent: 'center',
                alignItems: 'center',

            }}
        >
            <Box
                sx={{
                    backgroundColor: 'rgba(255, 254, 254, 1)',
                    padding: '20px',
                    borderRadius: '8px',
                    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.4)',
                    width: '100%',
                    maxWidth: 400,
                    mx: 'auto',
                    mt: 4,
                    boxSizing: 'border-box',
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

        </Box>
    );
};

export default Home;
