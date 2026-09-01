import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import CustomerLoginPage from '../pages/CustomerLoginPage'; // 👈 File mới cho Khách
import RegisterPage from '../pages/RegisterPage';
import ForgotPasswordPage from '../pages/ForgotPasswordPage';
import DashboardPage from '../pages/DashboardPage';
import ProductsPage from '../pages/ProductsPage';
import OrdersPage from '../pages/OrdersPage';
import ShopPage from '../pages/ShopPage';
import RoleRoute from '../components/common/RoleRoute';

export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/shop" replace />} />

            {/* Đăng nhập riêng biệt */}
            <Route path="/customer-login" element={<CustomerLoginPage />} />
            <Route path="/login" element={<LoginPage />} />

            {/* Trang công khai */}
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/shop" element={<ShopPage />} />

            {/* Trang quản trị nội bộ */}
            <Route path="/dashboard" element={
                <RoleRoute allowedRoles={['Admin', 'Manager', 'Staff']}><DashboardPage /></RoleRoute>
            } />
            <Route path="/products" element={
                <RoleRoute allowedRoles={['Admin', 'Manager']}><ProductsPage /></RoleRoute>
            } />
            <Route path="/orders" element={
                <RoleRoute allowedRoles={['Admin', 'Manager', 'Staff']}><OrdersPage /></RoleRoute>
            } />

            <Route path="*" element={<Navigate to="/shop" replace />} />
        </Routes>
    );
}