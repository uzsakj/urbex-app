import { Avatar, Badge, Box, Button, Paper, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '../store'
import { fetchProfile } from '../features/profile/profileSlice'
import { useParams } from 'react-router-dom'
import { fetchFriends, requestFriend } from '../features/friendship/friendSlice'
import { fetchLocations } from '../features/location/locationSlice'

const Profile: React.FC = () => {

    const dispatch = useDispatch<AppDispatch>()

    const profile = useSelector((state: RootState) => state.profile)
    const user = useSelector((state: RootState) => state.auth.user)
    const friends = useSelector((state: RootState) => state.friends.friends)
    const locations = useSelector((state: RootState) => state.locations)

    const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
    const { userId } = useParams()

    const isOwnProfile = userId === 'me' || !userId || userId === user?.id;
    const isFriend = friends.some(friend =>
        friend.requester.id === userId || friend.recipient.id === userId
    );

    useEffect(() => {
        dispatch(fetchProfile(userId || 'me'))
        dispatch(fetchFriends(userId || 'me'))
        dispatch(fetchLocations())
    }, [dispatch, userId])

    useEffect(() => {
        if (profile.data) {
            setAvatarUrl(profile.data.avatarUrl || null)
        }
    }, [profile.data])


    return (
        <Box
            sx={{
                display: 'flex',
                height: '100vh',
                width: '100%',
                boxSizing: 'border-box',
                padding: 2,
                gap: 2,
            }}
        >
            <Box
                sx={{
                    width: '33.33%',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                }}
            >
                <Paper sx={{ flex: 1, padding: 2 }}>
                    <Badge sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Avatar
                            src={avatarUrl || undefined}
                            sx={{ width: 100, height: 100, mb: 1 }}
                        />

                        <Typography variant="h6" gutterBottom>
                            {profile.data?.fullName}
                        </Typography>

                        {profile.data?.biography && (
                            <Typography
                                variant="body2"
                                color="text.secondary"
                                textAlign="center"
                                sx={{ mb: 1 }}
                            >
                                {profile.data.biography}
                            </Typography>
                        )}

                        <Typography variant="body2" color="text.secondary">
                            📍 {profile.data?.city || 'Unknown City'}, {profile.data?.country || 'Unknown Country'}
                        </Typography>

                        <Typography variant="body2" color="text.secondary">
                            Gender: {profile.data?.gender || 'Not specified'}
                        </Typography>

                        <Typography variant="body2" color="text.secondary">
                            Birthday: {profile.data?.birthDate
                                ? new Date(profile.data.birthDate).toLocaleDateString(undefined, { month: 'long', day: 'numeric' })
                                : 'Date of birth not provided'}
                        </Typography>

                        {!isOwnProfile && !isFriend && (
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => dispatch(requestFriend(userId!))}
                                sx={{ mt: 1 }}
                            >
                                Add Friend
                            </Button>
                        )}

                    </Badge>


                </Paper>
                <Paper sx={{ flex: 2, padding: 2 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                        <Typography variant="h6">Friends {friends.length}</Typography>
                        <Typography
                            variant="body2"
                            color="primary"
                            sx={{ cursor: 'pointer' }}
                            onClick={() => {
                                console.log("Open friend list modal");
                            }}
                        >
                            See all friends
                        </Typography>
                    </Box>

                    <Box display="flex" flexWrap="wrap" gap={1}>
                        {friends.slice(0, 6).map((friend) => (
                            <Avatar
                                key={friend.id}
                                src={friend.profile.avatarUrl || undefined}
                                alt={friend.profile.fullName}
                                title={friend.profile.fullName}
                                sx={{ width: 48, height: 48 }}
                            />
                        ))}
                    </Box>
                </Paper>
                <Paper sx={{ flex: 2, padding: 2 }}>
                    <Typography variant="h6">Locations {locations.items.length}</Typography>
                </Paper>
            </Box>

            <Box
                sx={{
                    width: '66.66%',
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                <Paper sx={{ flex: 1, padding: 2 }}>
                    <Typography variant="h6">User Feed</Typography>
                    {/* Feed items go here */}
                </Paper>
            </Box>
        </Box >
    )
}

export default React.memo(Profile)
