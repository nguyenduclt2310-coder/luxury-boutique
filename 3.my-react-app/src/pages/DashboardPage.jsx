import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { DollarSign, ShoppingBag, Clock, AlertTriangle, RefreshCw } from 'lucide-react';

export default function DashboardPage() {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const activeTab = queryParams.get('tab') || 'revenue';

    const [stats, setStats] = useState({
        totalRevenue: 0,
        totalOrders: 0,
        pendingOrders: 0,
        lowStockCount: 0,
        recentOrders: [],
        lowStockVariants: []
    });
    const [loading, setLoading] = useState(true);

    const fetchDashboardStats = async () => {
        try {
            setLoading(true);
            const res = await axios.get('http://localhost:5000/api/stats/dashboard');
            if (res.data.success) {
                setStats(res.data.data);
            }
        } catch (err) {
            console.error('Lỗi tải thống kê dashboard:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardStats();
    }, []);

    return (
        <div style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h2 style={{ color: '#0f172a', margin: 0 }}>
                    {activeTab === 'revenue' && '📈 Thống Kê Doanh Thu & Đơn Hàng'}
                    {activeTab === 'pending' && '⏳ Danh Sách Đơn Hàng Chờ Xử Lý'}
                    {activeTab === 'stock' && '⚠️ Cảnh Báo Tồn Kho Sắp Hết'}
                </h2>
                <button
                    onClick={fetchDashboardStats}
                    style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', backgroundColor: '#fff', border: '1px solid #cbd5e1', borderRadius: '6px', cursor: 'pointer', fontWeight: '500' }}
                >
                    <RefreshCw size={16} /> Cập nhật dữ liệu
                </button>
            </div>

            {loading ? (
                <p>Đang tải dữ liệu...</p>
            ) : (
                <>
                    {/* TAB 1: THỐNG KÊ DOANH THU */}
                    {activeTab === 'revenue' && (
                        <div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '30px' }}>
                                <div style={cardStyle}>
                                    <div>
                                        <span style={{ fontSize: '13px', color: '#64748b' }}>Tổng Doanh Thu</span>
                                        <h3 style={{ margin: '8px 0 0', color: '#059669', fontSize: '20px' }}>
                                            {stats.totalRevenue.toLocaleString('vi-VN')} đ
                                        </h3>
                                    </div>
                                    <div style={{ ...iconBgStyle, backgroundColor: '#d1fae5', color: '#059669' }}>
                                        <DollarSign size={22} />
                                    </div>
                                </div>

                                <div style={cardStyle}>
                                    <div>
                                        <span style={{ fontSize: '13px', color: '#64748b' }}>Tổng Đơn Hàng</span>
                                        <h3 style={{ margin: '8px 0 0', color: '#2563eb', fontSize: '20px' }}>{stats.totalOrders}</h3>
                                    </div>
                                    <div style={{ ...iconBgStyle, backgroundColor: '#dbeafe', color: '#2563eb' }}>
                                        <ShoppingBag size={22} />
                                    </div>
                                </div>
                            </div>

                            <div style={sectionBoxStyle}>
                                <h3 style={{ margin: '0 0 16px', fontSize: '16px', color: '#1e293b' }}>🛒 Đơn Hàng Mới Nhất</h3>
                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                    <thead>
                                        <tr style={{ backgroundColor: '#f8fafc', textAlign: 'left', borderBottom: '2px solid #e2e8f0' }}>
                                            <th style={{ padding: '10px' }}>Mã Đơn</th>
                                            <th style={{ padding: '10px' }}>Khách Hàng</th>
                                            <th style={{ padding: '10px' }}>Tổng Tiền</th>
                                            <th style={{ padding: '10px' }}>Trạng Thái</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {stats.recentOrders.length === 0 ? (
                                            <tr>
                                                <td colSpan="4" style={{ padding: '16px', textAlign: 'center', color: '#94a3b8' }}>Chưa có đơn hàng nào</td>
                                            </tr>
                                        ) : (
                                            stats.recentOrders.map((o) => (
                                                <tr key={o._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                                    <td style={{ padding: '10px', fontWeight: 'bold', color: '#2563eb' }}>{o.orderNumber || o._id.substring(0, 6)}</td>
                                                    <td style={{ padding: '10px' }}>{o.customerInfo?.fullName || 'N/A'}</td>
                                                    <td style={{ padding: '10px', fontWeight: 'bold' }}>{o.totalAmount?.toLocaleString('vi-VN')} đ</td>
                                                    <td style={{ padding: '10px' }}>
                                                        <span style={{ backgroundColor: '#f1f5f9', padding: '2px 8px', borderRadius: '4px', fontSize: '12px' }}>{o.orderStatus}</span>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* TAB 2: ĐƠN CHỜ XỬ LÝ */}
                    {activeTab === 'pending' && (
                        <div style={sectionBoxStyle}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                                <Clock color="#d97706" size={24} />
                                <h3 style={{ margin: 0, fontSize: '18px', color: '#d97706' }}>Danh Sách Đơn Hàng Cần Xác Nhận Gấp</h3>
                            </div>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ backgroundColor: '#f8fafc', textAlign: 'left', borderBottom: '2px solid #e2e8f0' }}>
                                        <th style={{ padding: '10px' }}>Mã Đơn</th>
                                        <th style={{ padding: '10px' }}>Khách Hàng</th>
                                        <th style={{ padding: '10px' }}>SĐT</th>
                                        <th style={{ padding: '10px' }}>Tổng Tiền</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {stats.recentOrders.filter(o => o.orderStatus === 'pending').length === 0 ? (
                                        <tr>
                                            <td colSpan="4" style={{ padding: '16px', textAlign: 'center', color: '#059669', fontWeight: 'bold' }}>
                                                ✅ Không có đơn hàng nào đang chờ xử lý!
                                            </td>
                                        </tr>
                                    ) : (
                                        stats.recentOrders.filter(o => o.orderStatus === 'pending').map((o) => (
                                            <tr key={o._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                                <td style={{ padding: '10px', fontWeight: 'bold', color: '#2563eb' }}>{o.orderNumber || o._id.substring(0, 6)}</td>
                                                <td style={{ padding: '10px' }}>{o.customerInfo?.fullName || 'N/A'}</td>
                                                <td style={{ padding: '10px' }}>{o.customerInfo?.phone || 'N/A'}</td>
                                                <td style={{ padding: '10px', fontWeight: 'bold', color: '#d97706' }}>{o.totalAmount?.toLocaleString('vi-VN')} đ</td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* TAB 3: CẢNH BÁO TỒN KHO */}
                    {activeTab === 'stock' && (
                        <div style={sectionBoxStyle}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                                <AlertTriangle color="#dc2626" size={24} />
                                <h3 style={{ margin: 0, fontSize: '18px', color: '#dc2626' }}>Cảnh Báo Tồn Kho (&lt; 5 sản phẩm)</h3>
                            </div>

                            {stats.lowStockVariants.length === 0 ? (
                                <p style={{ color: '#059669', fontSize: '15px', fontWeight: '500' }}>
                                    ✅ Tất cả sản phẩm trong kho đều đang ở mức an toàn!
                                </p>
                            ) : (
                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                    <thead>
                                        <tr style={{ backgroundColor: '#f8fafc', textAlign: 'left', borderBottom: '2px solid #e2e8f0' }}>
                                            <th style={{ padding: '12px' }}>Tên Sản Phẩm</th>
                                            <th style={{ padding: '12px' }}>Biến Thể (Size/Màu)</th>
                                            <th style={{ padding: '12px' }}>Số Lượng Tồn Kho</th>
                                            <th style={{ padding: '12px' }}>Mã SKU</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {stats.lowStockVariants.map((v) => (
                                            <tr key={v._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                                <td style={{ padding: '12px', fontWeight: 'bold' }}>{v.productId?.name || 'Sản phẩm'}</td>
                                                <td style={{ padding: '12px' }}>{`${v.attributes?.size || 'FREE'} - ${v.attributes?.color || 'N/A'}`}</td>
                                                <td style={{ padding: '12px', color: '#dc2626', fontWeight: 'bold' }}>Còn {v.stock}</td>
                                                <td style={{ padding: '12px', fontSize: '12px', color: '#64748b' }}>{v.sku}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

const cardStyle = {
    backgroundColor: '#fff',
    padding: '16px',
    borderRadius: '8px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 1px 3px rgba(0,0,0,0.08)'
};

const iconBgStyle = {
    width: '44px',
    height: '44px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
};

const sectionBoxStyle = {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.08)'
};