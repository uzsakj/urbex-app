import { Routes, Route } from 'react-router-dom';
import Register from '../pages/Register';
import Login from '../pages/Login';
import Home from '../pages/Home';
import PrivateRoute from './PrivateRoute';
import Layout from '../components/Layout';
import Dashboard from '../pages/Dashboard';
import Profile from '../pages/Profile';
import AddLocationForm from '../components/AddLocationForm';

const AppRoutes = () => (
    <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<PrivateRoute element={<Layout><Dashboard /></Layout>} />} />
        <Route path="/profile/:userId" element={<PrivateRoute element={<Layout><Profile /></Layout>} />} />
        <Route path="/addLocation" element={<PrivateRoute element={<AddLocationForm />} />} />
    </Routes>
);

export default AppRoutes;
