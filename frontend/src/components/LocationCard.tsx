import React from 'react';
import {
    Card,
    CardContent,
    Typography,
    CardActions,
    Button,
    CardMedia,
    Chip,
    Box,
} from '@mui/material';
import { ILocation } from '../interfaces/location.interface';

interface LocationCardProps {
    location: ILocation;
    onView: (id: string) => void;
}

const LocationCard: React.FC<LocationCardProps> = ({ location, onView }) => {
    const { _id, name, description, photos, tags } = location;

    return (
        <Card sx={{ minWidth: 275, m: 2 }}>
            {photos && photos.length > 0 && (
                <CardMedia
                    component="img"
                    height="180"
                    image={photos[0]}
                    alt={name}
                />
            )}
            <CardContent>
                <Typography variant="h6" gutterBottom>
                    {name}
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                    {description}
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                    {tags.map((tag, idx) => (
                        <Chip key={idx} label={tag} size="small" />
                    ))}
                </Box>
            </CardContent>
            <CardActions>
                <Button size="small" onClick={() => onView(_id)}>View</Button>
            </CardActions>
        </Card>
    );
};

export default LocationCard;
