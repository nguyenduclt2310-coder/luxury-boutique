import React from 'react';
import { Navigate } from 'react-router-dom';

export default function RoleRoute({ allowedRoles, children }) {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    if (!token) return <Navigate to="/login" replace />;

    // Nếu Role của user không nằm trong danh sách cho phép
    if (!allowedRoles.includes(user.role)) {
        return (
            <div style={{ padding: '40px', textAlign: 'center' }}>
                <h2 style={{ color: '#ef4444' }}>403 - Truy Cập Bị Từ Chối</h2>
                <p style={{ color: '#64748b' }}>Tài khoản của bạn ({user.role}) không có quyền truy cập vào chức năng này.</p>
            </div>
        );
    }

    return children;
}