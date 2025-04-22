// PrivateRoute.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';

interface PrivateRouteProps {
    element: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ element }) => {
    const isAuthenticated = Boolean(localStorage.getItem('authToken'));

    return isAuthenticated ? (
        <>{element}</> // Render the element if authenticated
    ) : (
        <Navigate to="/login" /> // Redirect to login if not authenticated
    );
};

export default PrivateRoute;
