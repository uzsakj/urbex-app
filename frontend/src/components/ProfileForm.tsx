import React, { useState, ChangeEvent, FormEvent } from 'react';
import {
    Box,
    Button,
    TextField,
    Typography,
    Paper,
    Snackbar,
    Alert,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';


type ProfileData = {
    fullName: string;
    biography: string;
    province: string;
};

const apiDomain: string = import.meta.env.VITE_API_DOMAIN || '';

const ProfileForm: React.FC = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState<ProfileData>({
        fullName: '',
        biography: '',
        province: '',
    });

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>(
        'success'
    );

    const handleChange = (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        const authToken = localStorage.getItem('authToken');
        if (!authToken) {
            setSnackbarMessage('You must be logged in to update your profile.');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
            return;
        }

        try {
            // Use fetch instead of axios
            const response = await fetch(`${apiDomain}/profile`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${authToken}`,
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Something went wrong');
            }

            setSnackbarMessage('Profile updated successfully!');
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
            navigate('/dashboard')
        } catch (error) {
            // Handle error properly
            setSnackbarMessage(`Something went wrong. ${error}`);
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        }
    };

    const handleSkip = () => {
        navigate('/dashboard'); // Go directly to dashboard
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
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
            }}>
            <Paper elevation={3} sx={{
                backgroundColor: 'rgba(255, 254, 254, 1)',
                padding: '20px',
                borderRadius: '8px',
                textShadow: '2px 2px 4px rgba(0, 0, 0, 0.4)',
                width: '100%',
                maxWidth: '400px',
            }}>
                <Typography variant="h5" align="center" gutterBottom>
                    Profile Form
                </Typography>

                <Typography
                    variant="body2"
                    color="textSecondary"
                    align="center"
                    sx={{ mb: 3 }}
                >
                    We'd love to get to know you! Please fill out your profile.
                    Nothing is required all field are optional and only used to help
                    personalize your experience.
                </Typography>

                <Box component="form" onSubmit={handleSubmit} noValidate>
                    <TextField
                        label="Full Name"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        variant="outlined"
                    />

                    <TextField
                        label="Biography"
                        name="biography"
                        value={formData.biography}
                        onChange={handleChange}
                        fullWidth
                        multiline
                        rows={4}
                        margin="normal"
                        variant="outlined"
                    />

                    <TextField
                        label="Province"
                        name="province"
                        value={formData.province}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        variant="outlined"
                    />

                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        sx={{ mt: 3, backgroundColor: '#03a9f4' }}
                    >
                        Save Profile
                    </Button>
                    <Button
                        onClick={handleSkip}
                        variant="contained"
                        color="primary"
                        fullWidth
                        sx={{ mt: 3, backgroundColor: '#757575' }}
                    >
                        Maybe later
                    </Button>
                </Box>
            </Paper>

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
            >
                <Alert
                    onClose={handleSnackbarClose}
                    severity={snackbarSeverity}
                    sx={{ width: '100%' }}
                >
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default ProfileForm;
