import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  LogOut,
  UserCheck,
  ChevronDown,
  ChevronRight,
  TrendingUp,
  AlertTriangle,
  Clock,
  Boxes,
  PlusCircle,
  FolderTree,
  Tag
} from 'lucide-react';

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const [isDashboardOpen, setIsDashboardOpen] = useState(true);
  const [isProductsOpen, setIsProductsOpen] = useState(true);

  const handleLogout = () => {
    if (window.confirm('Bạn có chắc muốn đăng xuất?')) {
      localStorage.clear();
      navigate('/login');
    }
  };

  const currentFullPath = location.pathname + location.search;

  const dashboardSubItems = [
    { path: '/dashboard?tab=revenue', label: 'Thống Kê Doanh Thu', icon: TrendingUp },
    { path: '/dashboard?tab=pending', label: 'Đơn Chờ Xử Lý', icon: Clock },
    { path: '/dashboard?tab=stock', label: 'Cảnh Báo Tồn Kho', icon: AlertTriangle },
  ];

  // 4 CHỨC NĂNG DÀNH CHO QUẢN LÝ HÀNG HÓA
  const productSubItems = [
    { path: '/products?tab=list', label: 'Danh Sách & Tồn Kho', icon: Boxes },
    { path: '/products?tab=add', label: 'Thêm Sản Phẩm Mới', icon: PlusCircle },
    { path: '/products?tab=categories', label: 'Quản Lý Danh Mục & BST', icon: FolderTree },
    { path: '/products?tab=promotional', label: 'Giá Khuyến Mãi & Sale', icon: Tag },
  ];

  return (
    <aside style={styles.sidebar}>
      <div>
        <h2 style={styles.logo}>LUXURY BOUTIQUE</h2>

        <div style={styles.userProfile}>
          <UserCheck size={20} color="#38bdf8" />
          <div>
            <div style={styles.userName}>{user.name || 'Nguyễn Văn Đức'}</div>
            <div style={styles.userRoleBadge}>{user.role || 'ADMIN'}</div>
          </div>
        </div>

        <nav style={styles.nav}>
          {/* QUẢN LÝ BẢNG ĐIỀU KHIỂN */}
          <div style={styles.menuGroup}>
            <div onClick={() => setIsDashboardOpen(!isDashboardOpen)} style={styles.parentLink}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <LayoutDashboard size={18} />
                <span>Quản Lý Bảng Điều Khiển</span>
              </div>
              {isDashboardOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </div>

            {isDashboardOpen && (
              <div style={styles.subMenuContainer}>
                {dashboardSubItems.map((item, idx) => {
                  const Icon = item.icon;
                  const isActive = currentFullPath === item.path || (location.pathname === '/dashboard' && !location.search && idx === 0);
                  return (
                    <Link key={idx} to={item.path} style={{ ...styles.childLink, backgroundColor: isActive ? '#2563eb' : 'transparent', color: isActive ? '#ffffff' : '#94a3b8' }}>
                      <Icon size={15} />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* QUẢN LÝ HÀNG HÓA - HIỂN THỊ ĐẦY ĐỦ 4 NÚT XỔ XUỐNG */}
          {['Admin', 'Manager'].includes(user.role || 'ADMIN') && (
            <div style={styles.menuGroup}>
              <div onClick={() => setIsProductsOpen(!isProductsOpen)} style={styles.parentLink}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Package size={18} />
                  <span>Quản Lý Hàng Hóa</span>
                </div>
                {isProductsOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              </div>

              {isProductsOpen && (
                <div style={styles.subMenuContainer}>
                  {productSubItems.map((item, idx) => {
                    const Icon = item.icon;
                    const isActive = currentFullPath === item.path || (location.pathname === '/products' && !location.search && idx === 0);
                    return (
                      <Link key={idx} to={item.path} style={{ ...styles.childLink, backgroundColor: isActive ? '#2563eb' : 'transparent', color: isActive ? '#ffffff' : '#94a3b8' }}>
                        <Icon size={15} />
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* XỬ LÝ ĐƠN HÀNG */}
          <Link to="/orders" style={{ ...styles.singleLink, backgroundColor: location.pathname === '/orders' ? '#2563eb' : 'transparent', color: location.pathname === '/orders' ? '#ffffff' : '#e2e8f0' }}>
            <ShoppingCart size={18} />
            <span>Xử Lý Đơn Hàng</span>
          </Link>
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
  sidebar: { width: '250px', backgroundColor: '#0f172a', color: '#fff', padding: '20px', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', fontFamily: "'Inter', sans-serif" },
  logo: { fontSize: '18px', fontWeight: 'bold', color: '#38bdf8', textAlign: 'center', marginBottom: '20px' },
  userProfile: { display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: '#1e293b', padding: '12px', borderRadius: '8px', marginBottom: '20px' },
  userName: { fontSize: '14px', fontWeight: 'bold' },
  userRoleBadge: { fontSize: '11px', color: '#38bdf8', textTransform: 'uppercase', letterSpacing: '0.5px' },
  nav: { display: 'flex', flexDirection: 'column', gap: '8px' },
  menuGroup: { display: 'flex', flexDirection: 'column' },
  parentLink: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', borderRadius: '8px', cursor: 'pointer', color: '#e2e8f0', fontSize: '14px', fontWeight: '600', userSelect: 'none' },
  subMenuContainer: { display: 'flex', flexDirection: 'column', gap: '4px', paddingLeft: '16px', marginTop: '4px', marginBottom: '8px' },
  childLink: { display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 12px', borderRadius: '6px', textDecoration: 'none', fontSize: '13px', fontWeight: '500', transition: 'all 0.2s' },
  singleLink: { display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: '8px', textDecoration: 'none', fontSize: '14px', fontWeight: '600', transition: 'all 0.2s' },
  logoutBtn: { display: 'flex', alignItems: 'center', gap: '10px', padding: '12px', backgroundColor: '#ef4444', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', justifyContent: 'center' }
};