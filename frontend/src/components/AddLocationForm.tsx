import React, { useState } from 'react';
import {
    Box,
    IconButton,
    Typography,
    TextField,
    Button,
    CircularProgress,
    Stepper,
    Step,
    StepLabel,
    MenuItem,
    Select,
    FormControl,
    InputLabel
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import LocationPicker from './LocationPicker';
import { Chip, OutlinedInput } from '@mui/material';
import { createLocation } from '../features/location/locationSlice';
import { AppDispatch } from '../store';
import { useDispatch } from 'react-redux';
import { showSnackbar } from '../features/ui/uiSlice';
import { SnackbarSeverity } from '../features/ui/types';

const AddLocationForm = () => {
    const [activeStep, setActiveStep] = useState(0);

    const dispatch = useDispatch<AppDispatch>();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [coordinates, setCoordinates] = useState<{ lng: number; lat: number } | null>(null);
    const [visibility, setVisibility] = useState('public');
    const [photos, setPhotos] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [tags, setTags] = useState<string[]>([]);
    const [tagInput, setTagInput] = useState('');

    const steps = ['Details', 'Pick Location', 'Upload Photos'];

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;
        const fileArray = Array.from(files);
        const newPreviews = fileArray.map((file) => URL.createObjectURL(file));
        setPhotos((prev) => [...prev, ...fileArray]);
        setPreviews((prev) => [...prev, ...newPreviews]);
    };

    const handleSubmit = async () => {
        const formData = new FormData();
        const geojsonPoint = {
            type: "Point",
            coordinates: [coordinates!.lng, coordinates!.lat],
        };
        formData.append('name', name);
        formData.append('description', description);
        formData.append('coordinates', JSON.stringify(geojsonPoint));
        formData.append('visibility', visibility);
        formData.append('tags', tags.join(','));

        photos.forEach((photo) => formData.append('photos', photo));

        setLoading(true);

        try {
            dispatch(createLocation(formData));
            setName('');
            setDescription('');
            setCoordinates(null);
            setVisibility('public');
            setTags([]);
            setPhotos([]);
            setPreviews([]);
            dispatch(showSnackbar({ message: 'Location added successfully', severity: SnackbarSeverity.SUCCESS }))
            setActiveStep(0);
        } catch {
            dispatch(showSnackbar({ message: 'Failed to add location', severity: SnackbarSeverity.ERROR }))
        } finally {
            setLoading(false);
        }
    };

    const renderStepContent = (step: number) => {
        switch (step) {
            case 0:
                return (
                    <>
                        <TextField
                            label="Name"
                            variant="outlined"
                            fullWidth
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            sx={{ mb: 2, }}
                        />
                        <TextField
                            label="Description"
                            variant="outlined"
                            fullWidth
                            multiline
                            rows={4}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                            sx={{ mb: 2 }}
                        />
                        <FormControl fullWidth sx={{ mb: 2 }} >
                            <InputLabel id="demo-multiple-chip-label">Visibility</InputLabel>
                            <Select
                                value={visibility}
                                label="Visibility"
                                onChange={(e) => setVisibility(e.target.value)}
                            >
                                <MenuItem value={'public'}>public</MenuItem>
                                <MenuItem value={'private'}>private</MenuItem>
                                <MenuItem value={'friends'}>friends</MenuItem>
                            </Select>
                        </FormControl >

                        <Box sx={{ width: '100%' }}>


                            <OutlinedInput
                                fullWidth
                                value={tagInput}
                                onChange={(e) => setTagInput(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && tagInput.trim()) {
                                        e.preventDefault();
                                        const trimmed = tagInput.trim();
                                        if (!tags.includes(trimmed)) {
                                            setTags([...tags, trimmed]);
                                        }
                                        setTagInput('');
                                    }
                                }}
                                placeholder="Add a tag and press Enter"
                            />
                        </Box>
                        <Box
                            sx={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                gap: 1,
                                m: 1,
                            }}
                        >
                            {tags.map((tag, index) => (
                                <Chip
                                    key={index}
                                    label={tag}
                                    onDelete={() => {
                                        setTags(tags.filter((_, i) => i !== index));
                                    }}
                                />
                            ))}
                        </Box>
                        {<Typography color="error" sx={{ mt: 2, display: 'flex' }}>*Required field</Typography>}


                    </>
                );
            case 1:
                return (
                    <Box sx={{ mb: 2 }}>
                        <LocationPicker coordinates={coordinates} setCoordinates={setCoordinates} />
                    </Box>
                );
            case 2:
                return (
                    <>

                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            id="photo-upload"
                            style={{ display: 'none' }}
                            onChange={handlePhotoChange}
                        />
                        <label htmlFor="photo-upload">
                            <Box
                                sx={{
                                    width: 150, height: 150, border: '2px dashed #ccc',
                                    borderRadius: 2, display: 'flex', alignItems: 'center',
                                    justifyContent: 'center', cursor: 'pointer', mb: 2,
                                }}
                            >
                                <IconButton color="primary" component="span">
                                    <AddIcon fontSize="large" />
                                </IconButton>
                            </Box>
                        </label>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                            {previews.map((src, index) => (
                                <Box
                                    key={index}
                                    sx={{
                                        position: 'relative', width: 100, height: 100,
                                        borderRadius: 2, overflow: 'hidden', border: '1px solid #ddd',
                                    }}
                                >
                                    <img
                                        src={src}
                                        alt={`preview-${index}`}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                    <IconButton
                                        size="small"
                                        sx={{
                                            position: 'absolute', top: 4, right: 4,
                                            backgroundColor: 'rgba(255, 255, 255, 0.7)',
                                            '&:hover': { backgroundColor: 'rgba(255, 255, 255, 1)' },
                                        }}
                                        onClick={() => {
                                            const newPhotos = [...photos];
                                            const newPreviews = [...previews];
                                            newPhotos.splice(index, 1);
                                            newPreviews.splice(index, 1);
                                            setPhotos(newPhotos);
                                            setPreviews(newPreviews);
                                        }}
                                    >
                                        <CloseIcon fontSize="small" />
                                    </IconButton>
                                </Box>
                            ))}
                        </Box>
                    </>
                );
            default:
                return null;
        }
    };

    return (
        <Box sx={{
            width: '100%',
            maxWidth: '700px',
            borderRadius: 2,
            boxShadow: 3,
            backgroundColor: 'rgba(255, 254, 254, 1)',
            mx: 'auto',
            mt: 5,
            p: 3,
        }}>
            <Typography variant="h5" gutterBottom sx={{ textAlign: 'center', width: '100%' }}>Add New Location</Typography>
            <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
                {steps.map((label) => (
                    <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                    </Step>
                ))}
            </Stepper>

            <Box component="div">
                {renderStepContent(activeStep)}

                <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
                    <Button
                        type="button"
                        disabled={activeStep === 0}
                        onClick={() => setActiveStep((prev) => prev - 1)}
                    >
                        Back
                    </Button>

                    {activeStep < steps.length - 1 ? (
                        <Button
                            type="button"
                            onClick={() => setActiveStep((prev) => prev + 1)}
                        >
                            Next
                        </Button>
                    ) : (
                        <Button
                            onClick={handleSubmit}
                            variant="contained"
                            color="primary"
                            disabled={loading}
                        >
                            {loading ? <CircularProgress size={24} /> : 'Submit'}
                        </Button>
                    )}
                </Box>
            </Box>

        </Box>
    );
};

export default AddLocationForm;
