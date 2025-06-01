// PrivateRoute.tsx

import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { RootState } from '../store';
interface PrivateRouteProps {
    element: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ element }) => {
    const user = useSelector((state: RootState) => state.auth.user)

    return user ? (
        <>{element}</> // Render the element if authenticated
    ) : (
        <Navigate to="/login" /> // Redirect to login if not authenticated
    );
};

export default PrivateRoute;
