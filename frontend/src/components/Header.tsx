import React, { useEffect, useState } from 'react';
import {
    Drawer, List, ListItem, ListItemText, IconButton, Toolbar, AppBar, Typography,
    Box, ListItemButton, Badge, Popover, ListItemAvatar, Avatar,
    TextField, InputAdornment, Popper, Paper, MenuList, MenuItem, CircularProgress
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SearchIcon from '@mui/icons-material/Search';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { fetchNotifications, markNotificationAsRead } from '../features/notification/notificationSlice';
import {
    fetchUserResults,
    fetchLocationResults,
    clearResults,
} from '../features/search/searchSlice';
import { SearchResult } from '../features/search/types';
import { Status } from '../store/status.enum';
import { logout } from '../features/auth/authSlice';


const Header: React.FC = () => {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchAnchorEl, setSearchAnchorEl] = useState<null | HTMLElement>(null);

    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const { notifications } = useSelector((state: RootState) => state.notifications);
    const unreadCount = notifications.filter(n => !n.isRead).length;

    const { userResults, locationResults, status } = useSelector((state: RootState) => state.search);


    const menuItems = [
        { text: 'Home', to: '/' },
        { text: 'Profile', to: '/profile/me' },
        { text: 'Dashboard', to: '/dashboard' },
        { text: 'Add Location', to: '/addLocation' },
        {
            text: 'Logout',
            onClick: () => {
                dispatch(logout());
                navigate('/');
            },
        },
    ];

    useEffect(() => {
        dispatch(fetchNotifications());
    }, [dispatch]);

    useEffect(() => {
        const timeout = setTimeout(() => {
            if (searchTerm.trim()) {
                dispatch(fetchUserResults(searchTerm));
                dispatch(fetchLocationResults(searchTerm));
            } else {
                dispatch(clearResults());
            }
        }, 400);

        return () => clearTimeout(timeout);
    }, [searchTerm, dispatch]);

    const toggleDrawer = (state: boolean) => () => setDrawerOpen(state);

    const handleNotificationClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleNotificationClose = () => setAnchorEl(null);

    const openNotifications = Boolean(anchorEl);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        setSearchAnchorEl(e.currentTarget);
    };

    const handleSearchClose = () => {
        setSearchTerm('');
        setSearchAnchorEl(null);
        dispatch(clearResults());
    };

    const handleResultClick = (result: SearchResult) => {
        if (result.type === 'user') {
            navigate(`/profile/${result.id}`);
        } else if (result.type === 'location') {
            navigate(`/locations/${result.id}`);
        }
        handleSearchClose();
    };

    return (
        <>
            <AppBar position="fixed" sx={{ width: '100%', zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                <Toolbar sx={{ justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <IconButton color="inherit" onClick={toggleDrawer(!drawerOpen)} sx={{ mr: 2 }}>
                            <MenuIcon />
                        </IconButton>
                        <Typography variant="h6" noWrap>
                            UrbexHub
                        </Typography>
                    </Box>

                    {/* Search bar */}
                    <TextField
                        size="small"
                        placeholder="Search users or locations"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        sx={{ bgcolor: 'background.paper', borderRadius: 1, width: 300 }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon />
                                </InputAdornment>
                            ),
                            endAdornment: status === Status.LOADING ? (
                                <InputAdornment position="end">
                                    <CircularProgress size={20} />
                                </InputAdornment>
                            ) : undefined,
                        }}
                        onBlur={() => {
                            // Delay close to allow click on results
                            setTimeout(() => handleSearchClose(), 150);
                        }}
                    />

                    <IconButton color="inherit" onClick={handleNotificationClick} sx={{ ml: 2 }}>
                        <Badge badgeContent={unreadCount} color="error">
                            <NotificationsIcon />
                        </Badge>
                    </IconButton>
                </Toolbar>
            </AppBar>

            <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
                <Box sx={{ width: 250, paddingTop: '64px' }} role="presentation" onClick={toggleDrawer(false)}>
                    <List>
                        {menuItems.map((item) => (
                            <ListItem
                                key={item.text}
                                component={item.to ? Link : 'li'}
                                to={item.to}
                                onClick={item.onClick}
                                style={{ cursor: item.onClick ? 'pointer' : undefined }}
                            >
                                <ListItemButton>
                                    <ListItemText primary={item.text} />
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                </Box>
            </Drawer>

            <Popover
                open={openNotifications}
                anchorEl={anchorEl}
                onClose={handleNotificationClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <List sx={{ width: 300, maxHeight: 400, overflowY: 'auto' }}>
                    {notifications.length === 0 ? (
                        <ListItem><ListItemText primary="No notifications" /></ListItem>
                    ) : (
                        notifications.map((notif) => (
                            <ListItem
                                key={notif.id}
                                sx={{ bgcolor: notif.isRead ? 'inherit' : '#f5f5f5' }}
                                disablePadding
                            >
                                <ListItemButton onClick={() => dispatch(markNotificationAsRead(notif.id))}>
                                    {notif.sender?.profile?.avatarUrl && (
                                        <ListItemAvatar>
                                            <Avatar src={notif.sender.profile.avatarUrl} />
                                        </ListItemAvatar>
                                    )}
                                    <ListItemText
                                        primary={notif.message || 'You have a notification'}
                                        secondary={new Date(notif.createdAt).toLocaleString()}
                                    />
                                </ListItemButton>
                            </ListItem>
                        ))
                    )}
                </List>
            </Popover>

            <Popper
                open={(userResults?.length > 0 || locationResults.length > 0) && !!searchAnchorEl}
                anchorEl={searchAnchorEl}
                placement="bottom-start"
                sx={{ zIndex: 1300 }}
            >
                <Paper sx={{ width: 300, mt: 1, maxHeight: 300, overflowY: 'auto' }}>
                    <MenuList dense>
                        {userResults.length > 0 && (
                            <Box>
                                <Typography sx={{ pl: 2, pt: 1, fontWeight: 'bold' }}>Users</Typography>
                                {userResults.map((user) => (
                                    <MenuItem
                                        key={`user-${user.id}`}
                                        onMouseDown={(e) => e.preventDefault()}
                                        onClick={() => handleResultClick({ ...user, type: 'user' })}
                                    >
                                        <Avatar
                                            src={user.profile?.avatarUrl || undefined}
                                            sx={{ width: 24, height: 24, mr: 1 }}
                                        >
                                            {user.profile?.fullName?.[0]?.toUpperCase() || "?"}
                                        </Avatar>
                                        {user.profile.fullName}
                                    </MenuItem>

                                ))}
                            </Box>
                        )}

                        {locationResults.length > 0 && (
                            <Box>
                                <Typography sx={{ pl: 2, pt: 1, fontWeight: 'bold' }}>Locations</Typography>
                                {locationResults.map((location) => (
                                    <MenuItem
                                        key={`location-${location.id}`}
                                        onMouseDown={(e) => e.preventDefault()}
                                        onClick={() => handleResultClick({ ...location, type: 'location' })}
                                    >
                                        📍 {location.name}
                                    </MenuItem>
                                ))}
                            </Box>
                        )}
                    </MenuList>
                </Paper>
            </Popper>
        </>
    );
};

export default Header;
