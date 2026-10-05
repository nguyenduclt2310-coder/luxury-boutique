import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import DashboardPage from '../pages/DashboardPage';
import ProductsPage from '../pages/ProductsPage';
import OrdersPage from '../pages/OrdersPage';

// Component bảo vệ Route theo Role
const RoleRoute = ({ children, allowedRoles }) => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    if (!token) return <Navigate to="/login" replace />;
    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default function AppRoutes() {
    return (
        <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Protected Admin Routes */}
            <Route
                path="/dashboard"
                element={
                    <RoleRoute allowedRoles={['Admin', 'Manager', 'Staff']}>
                        <DashboardPage />
                    </RoleRoute>
                }
            />

            <Route
                path="/products"
                element={
                    <RoleRoute allowedRoles={['Admin', 'Manager']}>
                        <ProductsPage />
                    </RoleRoute>
                }
            />

            <Route
                path="/orders"
                element={
                    <RoleRoute allowedRoles={['Admin', 'Manager', 'Staff']}>
                        <OrdersPage />
                    </RoleRoute>
                }
            />

            {/* Điều hướng mặc định */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
    );
}