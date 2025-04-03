import React, { useState, FormEvent } from 'react';
import { Button, TextField, Typography, Container, Grid, Paper, Box, Snackbar } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Register: React.FC = () => {
    const [username, setUsername] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [openSnackbar, setOpenSnackbar] = useState<boolean>(false); // To manage Snackbar visibility
    const [snackbarMessage, setSnackbarMessage] = useState<string>(''); // To manage Snackbar message

    const apiDomain: string = import.meta.env.VITE_API_DOMAIN || '';
    const navigate = useNavigate();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        const payload = { username, email, password };

        try {
            const response = await fetch(`${apiDomain}/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (response.ok) {
                setError(null);
                setSnackbarMessage('Registration successful! Redirecting to login...');
                setOpenSnackbar(true);

                // Navigate to login after 5 seconds
                setTimeout(() => {
                    navigate('/login');
                }, 5000);
            } else {
                setError(data.message || data.error || 'Something went wrong');
            }
        } catch (err) {
            setError(`Error occured: ${err}`);
        }
    };

    return (
        <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
            <Container component="main" maxWidth="xs">
                <Paper elevation={3} sx={{ padding: 3 }}>
                    <Typography variant="h5" component="h1" gutterBottom>
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
                        {error && <Typography color="error">{error}</Typography>}
                        <Button type="submit" fullWidth variant="contained" color="primary" sx={{ mt: 3 }}>
                            Register
                        </Button>
                    </form>

                    <Grid container justifyContent="flex-end" sx={{ mt: 2 }}>
                        <Grid>
                            <Button onClick={() => navigate('/login')} color="primary">
                                Already have an account? Login
                            </Button>
                        </Grid>
                    </Grid>
                </Paper>
            </Container>

            <Snackbar
                open={openSnackbar}
                autoHideDuration={5000}
                onClose={() => setOpenSnackbar(false)}
                message={snackbarMessage}
            />
        </Box>
    );
};

export default Register;
