import React from 'react';
import {
    Card,
    CardContent,
    Typography,
    CardMedia,
    Chip
} from '@mui/material';
import { Location } from '../features/location/types';

interface LocationCardProps {
    location: Location;
}

const LocationCard: React.FC<LocationCardProps> = ({ location }) => {
    const { _id, title, description, photos, tags } = location;

    return (
        <Card sx={{ width: '100%', flexShrink: 1, flexGrow: 0, m: 2 }}>
            {photos && photos.length > 0 && (
                <CardMedia
                    component="img"
                    height="180"
                    image={photos[0]}
                    alt={title}
                />
            )}
            <CardContent>
                <Typography variant="h6" gutterBottom>
                    {title}
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                    {description}
                </Typography>
                {tags.length > 0 ? (
                    tags.map((tag, idx) => (
                        <Chip key={idx} label={tag} size="small" />
                    ))
                ) : (
                    <Chip size="small" sx={{ visibility: 'hidden' }} />
                )}
            </CardContent>
        </Card>
    );
};

export default LocationCard;
