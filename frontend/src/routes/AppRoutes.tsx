import { Routes, Route } from 'react-router-dom';
import Register from '../pages/Register';
import Login from '../pages/Login';
import Home from '../pages/Home';
import ProfileForm from '../components/ProfileForm';
import PrivateRoute from './PrivateRoute';

const AppRoutes = () => (
    <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<PrivateRoute element={<ProfileForm />} />} />
        <Route path="/" element={<Home />} />
    </Routes>
);

export default AppRoutes;
