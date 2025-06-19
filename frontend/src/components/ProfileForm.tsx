import React, { useState, useEffect, FormEvent } from 'react';
import {
    Box,
    Button,
    TextField,
    Typography,
    Avatar,
    Badge,
    IconButton,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import { Profile } from '../features/profile/types';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import { fetchProfile, saveProfile } from '../features/profile/profileSlice';
import { countries } from '../constants/countries';
import { showSnackbar } from '../features/ui/uiSlice';
import { SnackbarSeverity } from '../features/ui/types';

export type ProfileFormProps = {
    onClose: () => void;
};
const ProfileForm: React.FC<ProfileFormProps> = ({ onClose }) => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const profile = useSelector((state: RootState) => state.profile)
    const user = useSelector((state: RootState) => state.auth.user)
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
    const today = new Date().toISOString().split('T')[0];

    const [formData, setFormData] = useState<Profile>(profile.data || {
        fullName: '',
        biography: '',
        gender: '',
        birthDate: '',
        country: '',
        city: '',
        avatarUrl: '',
    });

    useEffect(() => {
        if (avatarFile) {
            const objectUrl = URL.createObjectURL(avatarFile);
            setAvatarUrl(objectUrl);

            return () => URL.revokeObjectURL(objectUrl);
        }
    }, [avatarFile]);

    useEffect(() => {
        dispatch(fetchProfile('me'));
    }, [dispatch]);

    useEffect(() => {
        if (profile.data) {
            setFormData({
                fullName: profile.data.fullName || '',
                biography: profile.data.biography || '',
                gender: profile.data.gender || '',
                birthDate: profile.data.birthDate || '',
                country: profile.data.country || '',
                city: profile.data.city || '',
                avatarUrl: profile.data.avatarUrl || '',
            });
            setAvatarUrl(profile.data.avatarUrl || '')
        }
    }, [profile.data])


    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };


    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        const authToken = localStorage.getItem('token');
        if (!authToken) {
            dispatch(showSnackbar({ message: 'You must be logged in to update your profile.', severity: SnackbarSeverity.ERROR }))
            return;
        }

        try {
            const hasChanges = (
                formData.fullName !== profile.data?.fullName ||
                formData.biography !== profile.data?.biography ||
                formData.country !== profile.data?.country ||
                formData.birthDate !== profile.data?.birthDate ||
                formData.city !== profile.data?.city ||
                avatarFile
            );

            if (!hasChanges) {
                dispatch(showSnackbar({ message: 'No changes to save.', severity: SnackbarSeverity.INFO }))
                return;
            }

            const formDataToSend = new FormData();
            if (formData.fullName !== undefined) {
                formDataToSend.append('fullName', formData.fullName);
            }
            if (formData.biography !== undefined) {
                formDataToSend.append('biography', formData.biography);
            }
            if (formData.gender !== undefined) {
                formDataToSend.append('gender', formData.gender);
            }
            if (formData.birthDate !== undefined) {
                formDataToSend.append('birthDate', formData.birthDate);
            }
            if (formData.country !== undefined) {
                formDataToSend.append('country', formData.country);
            }
            if (formData.city !== undefined) {
                formDataToSend.append('city', formData.city);
            }

            if (avatarFile) {
                formDataToSend.append('avatar', avatarFile, avatarFile.name);
            }


            await dispatch(saveProfile(formDataToSend))
            dispatch(fetchProfile('me'))
            dispatch(showSnackbar({ message: profile.data ? 'Profile updated successfully!' : 'Profile created successfully!', severity: SnackbarSeverity.SUCCESS }))
            onClose()
        } catch (error) {
            dispatch(showSnackbar({ message: `Something went wrong. ${error}`, severity: SnackbarSeverity.ERROR }))
        }
    };

    const handleSkip = () => {
        navigate('/dashboard');
    };


    return (
        <>

            <Typography variant="h6" gutterBottom sx={{ position: 'absolute', top: '8px', right: '8px' }}>
                <IconButton
                    onClick={onClose}
                >
                    <CloseIcon />
                </IconButton>
            </Typography >

            <Box sx={{ display: 'flex', justifyContent: 'center' }}>

                <Badge
                    overlap="circular"
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    badgeContent={
                        <IconButton component="label" color="primary" sx={{ bgcolor: 'white' }}>
                            <AddIcon />
                            <input
                                type="file"
                                hidden
                                accept="image/*"
                                onChange={(e) => {
                                    if (e.target.files?.[0]) {
                                        setAvatarFile(e.target.files[0]);
                                    }
                                }}
                            />
                        </IconButton>
                    }
                >
                    <Avatar
                        src={avatarUrl || undefined}
                        sx={{ width: 100, height: 100, mx: 'auto', mb: 2 }}
                    />
                </Badge >
            </Box >


            <Box component="form" onSubmit={handleSubmit} noValidate>
                <TextField
                    label="Full Name"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    fullWidth
                    margin="normal"
                    variant="outlined"
                    slotProps={{ inputLabel: { shrink: Boolean(formData.fullName) } }}
                />

                <TextField
                    select
                    label="Gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    fullWidth
                    margin="normal"
                    variant="outlined"
                    slotProps={{ select: { native: true }, inputLabel: { shrink: Boolean(formData.gender) } }}

                >
                    <option value="" disabled></option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="non-binary">Non-binary</option>
                    <option value="other">Other</option>
                </TextField>

                <TextField
                    label="Date of Birth"
                    type="date"
                    name="birthDate"
                    value={formData.birthDate}
                    onChange={handleInputChange}
                    fullWidth
                    margin="normal"
                    variant="outlined"
                    slotProps={{
                        inputLabel: { shrink: true },
                        htmlInput: { max: today }
                    }}
                />

                <TextField
                    select
                    label="Country"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    fullWidth
                    margin="normal"
                    variant="outlined"
                    slotProps={{ select: { native: true }, inputLabel: { shrink: Boolean(formData.gender) } }}
                >
                    <option value="" disabled></option>
                    {countries.map((country) => (
                        <option key={country} value={country}>
                            {country}
                        </option>
                    ))}
                </TextField>

                <TextField
                    label="City"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    fullWidth
                    margin="normal"
                    variant="outlined"
                    slotProps={{ inputLabel: { shrink: Boolean(formData.fullName) } }}
                />

                <TextField
                    label="Biography"
                    name="biography"
                    value={formData.biography}
                    onChange={handleInputChange}
                    fullWidth
                    multiline
                    rows={4}
                    margin="normal"
                    variant="outlined"
                    slotProps={{ inputLabel: { shrink: Boolean(formData.fullName) } }}
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

                {user?.profileIncomplete && <Button
                    onClick={handleSkip}
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ mt: 3, backgroundColor: '#757575' }}
                >
                    Maybe later
                </Button>}
            </Box>


        </>
    );
};

export default ProfileForm;


