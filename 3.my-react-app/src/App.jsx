import React from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from './components/common/Sidebar';
import AppRoutes from './routes/AppRoutes';

export default function App() {
  const location = useLocation();

  // Đọc user an toàn
  let user = {};
  try {
    user = JSON.parse(localStorage.getItem('user') || '{}');
  } catch (e) {
    user = {};
  }

  // Danh sách các trang ẩn Sidebar
  const publicRoutes = ['/login', '/register', '/forgot-password', '/shop'];
  const hideSidebar = publicRoutes.includes(location.pathname) || user?.role === 'Customer' || !localStorage.getItem('token');

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      {!hideSidebar && <Sidebar />}
      <main style={{ flex: 1, padding: hideSidebar ? '0' : '24px', overflowY: 'auto' }}>
        <AppRoutes />
      </main>
    </div>
  );
}