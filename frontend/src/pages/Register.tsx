import React, { useState, FormEvent } from 'react';
import { Button, TextField, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store/index.ts';
import { register } from '../features/auth/authSlice.ts';
import { Status } from '../store/status.enum.ts';
import { showSnackbar } from '../features/ui/uiSlice.ts';
import { SnackbarSeverity } from '../features/ui/types.ts';

const Register: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();

    const [username, setUsername] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const status = useSelector((state: RootState) => state.auth.status)


    const navigate = useNavigate();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        try {
            await dispatch(register({ username, email, password })).unwrap();
            dispatch(showSnackbar({ message: 'Registration successful! Redirecting to login..', severity: SnackbarSeverity.SUCCESS }))

            setTimeout(() => {
                navigate('/login');
            }, 3000)
        } catch (error) {
            dispatch(showSnackbar({ message: `Something went wrong ${error}`, severity: SnackbarSeverity.ERROR }))
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
                    Register
                </Typography>

                <form onSubmit={handleSubmit}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        label="Username"
                        variant="filled"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
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
                    <Button type="submit" fullWidth variant="contained" color="primary" sx={{ mt: 3, backgroundColor: '#03a9f4' }}>
                        {status === Status.LOADING ? 'Registering...' : 'Register'}
                    </Button>
                </form>

                <Button
                    onClick={() => navigate('/login')}
                    color="primary"
                    sx={{ mt: 2 }}
                >
                    Already have an account? Login
                </Button>
            </Box>
        </Box>
    );
};

export default Register;
