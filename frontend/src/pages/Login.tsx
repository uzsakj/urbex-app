import React, { useState, FormEvent } from 'react';
import { Button, TextField, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { login } from '../features/auth/authSlice';
import { AppDispatch, RootState } from '../store';
import { useDispatch, useSelector } from 'react-redux';
import { Status } from '../store/status.enum';

const Login: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const error = useSelector((state: RootState) => state.auth.error);
    const status = useSelector((state: RootState) => state.auth.status)

    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();


        const resultAction = await dispatch(login({ email, password }));

        if (login.fulfilled.match(resultAction)) {
            if (resultAction.payload.profileIncomplete) {
                navigate('/profile');
            } else {
                navigate('/');
            }
        }
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
            }}
        >
            <Box
                sx={{
                    backgroundColor: 'rgba(255, 254, 254, 1)',
                    padding: '20px',
                    borderRadius: '8px',
                    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.4)',
                    width: '100%',
                    maxWidth: '400px',
                }}
            >
                <Typography variant="h4" gutterBottom>
                    Login
                </Typography>

                <form onSubmit={handleSubmit}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        label="Email Address"
                        variant="filled"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        label="Password"
                        variant="filled"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    {error && <Typography color="error">{error}</Typography>}
                    <Button type="submit" fullWidth variant="contained" color="primary" sx={{ mt: 3, backgroundColor: '#757575' }}>
                        {status === Status.LOADING ? 'Logging in...' : 'Login'}
                    </Button>
                </form>

                <Button
                    onClick={() => navigate('/register')}
                    color="primary"
                    sx={{ mt: 2 }}
                >
                    Don't have an account? Register
                </Button>
            </Box>
        </Box>
    );
};

export default Login;
