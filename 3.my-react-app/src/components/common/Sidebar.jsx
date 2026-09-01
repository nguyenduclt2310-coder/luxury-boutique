import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingCart, LogOut, UserCheck } from 'lucide-react';

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  // Danh mục menu có kèm quyền truy cập
  const allMenuItems = [
    { path: '/dashboard', label: 'Bảng Điều Khiển', icon: LayoutDashboard, roles: ['Admin', 'Manager', 'Staff'] },
    { path: '/products', label: 'Quản Lý Hàng Hóa', icon: Package, roles: ['Admin', 'Manager'] },
    { path: '/orders', label: 'Xử Lý Đơn Hàng', icon: ShoppingCart, roles: ['Admin', 'Manager', 'Staff'] },
  ];

  // Chỉ hiển thị menu phù hợp với Role của user
  const visibleMenu = allMenuItems.filter(item => item.roles.includes(user.role || 'Staff'));

  const handleLogout = () => {
    if (window.confirm('Bạn có chắc muốn đăng xuất?')) {
      localStorage.clear();
      navigate('/login');
    }
  };

  return (
    <aside style={styles.sidebar}>
      <div>
        <h2 style={styles.logo}>DOANH NGHIỆP ERP</h2>
        
        <div style={styles.userProfile}>
          <UserCheck size={20} color="#38bdf8" />
          <div>
            <div style={styles.userName}>{user.name || 'Người dùng'}</div>
            <div style={styles.userRoleBadge}>{user.role || 'Staff'}</div>
          </div>
        </div>

        <nav style={styles.nav}>
          {visibleMenu.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                style={{
                  ...styles.link,
                  backgroundColor: isActive ? '#2563eb' : 'transparent',
                  color: isActive ? '#ffffff' : '#94a3b8'
                }}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <button onClick={handleLogout} style={styles.logoutBtn}>
        <LogOut size={18} />
        <span>Đăng Xuất</span>
      </button>
    </aside>
  );
}

const styles = {
  sidebar: { width: '250px', backgroundColor: '#0f172a', color: '#fff', padding: '20px', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' },
  logo: { fontSize: '18px', fontWeight: 'bold', color: '#38bdf8', textAlign: 'center', marginBottom: '20px' },
  userProfile: { display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: '#1e293b', padding: '12px', borderRadius: '8px', marginBottom: '20px' },
  userName: { fontSize: '14px', fontWeight: 'bold' },
  userRoleBadge: { fontSize: '11px', color: '#38bdf8', textTransform: 'uppercase', letterSpacing: '0.5px' },
  nav: { display: 'flex', flexDirection: 'column', gap: '8px' },
  link: { display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 14px', borderRadius: '8px', textDecoration: 'none', fontSize: '14px', fontWeight: '500' },
  logoutBtn: { display: 'flex', alignItems: 'center', gap: '10px', padding: '12px', backgroundColor: '#ef4444', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }
};