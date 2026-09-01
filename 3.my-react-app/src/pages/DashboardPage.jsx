import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Package, DollarSign, ShoppingBag, AlertTriangle, ShieldCheck, UserCheck, Clock } from 'lucide-react';

export default function DashboardPage() {
    const [stats, setStats] = useState(null);
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    useEffect(() => {
        axios.get('http://localhost:5000/api/stats/summary')
            .then(res => setStats(res.data))
            .catch(err => console.error('Lỗi tải thống kê:', err));
    }, []);

    if (!stats) return <div style={{ padding: '20px', color: '#64748b' }}>Đang tải dữ liệu tổng quan...</div>;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Banner Chào Mừng Phân Theo Quyền */}
            <div style={styles.welcomeBanner}>
                <div>
                    <h2 style={{ margin: 0, color: '#0f172a' }}>Xin chào, {user.name || 'Người dùng'} 👋</h2>
                    <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: '14px' }}>
                        Vai trò hệ thống: <span style={styles.roleBadge}>{user.role || 'Staff'}</span>
                    </p>
                </div>
            </div>

            {/* 1. Giao diện cho Admin & Manager (Đầy đủ KPI Kho, Tiền và Biểu đồ) */}
            {['Admin', 'Manager'].includes(user.role) && (
                <>
                    <div style={styles.cardGrid}>
                        <div style={styles.card}>
                            <div>
                                <p style={styles.cardLabel}>Tổng sản phẩm</p>
                                <h3 style={styles.cardVal}>{stats.totalProducts}</h3>
                            </div>
                            <Package color="#2563eb" size={32} />
                        </div>

                        <div style={styles.card}>
                            <div>
                                <p style={styles.cardLabel}>Tổng giá trị kho</p>
                                <h3 style={styles.cardVal}>{(stats.totalInventoryValue || 0).toLocaleString('vi-VN')} đ</h3>
                            </div>
                            <DollarSign color="#16a34a" size={32} />
                        </div>

                        <div style={styles.card}>
                            <div>
                                <p style={styles.cardLabel}>Tổng mục hàng</p>
                                <h3 style={styles.cardVal}>{stats.totalOrders}</h3>
                            </div>
                            <ShoppingBag color="#9333ea" size={32} />
                        </div>

                        <div style={styles.card}>
                            <div>
                                <p style={styles.cardLabel}>Cảnh báo hết hàng</p>
                                <h3 style={{ ...styles.cardVal, color: stats.outOfStockCount > 0 ? '#dc2626' : '#0f172a' }}>
                                    {stats.outOfStockCount}
                                </h3>
                            </div>
                            <AlertTriangle color="#dc2626" size={32} />
                        </div>
                    </div>

                    <div style={styles.chartContainer}>
                        <h3 style={{ marginBottom: '16px', color: '#1e293b' }}>📊 Doanh Thu Theo Tháng</h3>
                        <div style={{ width: '100%', height: 350 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={stats.monthlyRevenue}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="month" />
                                    <YAxis />
                                    <Tooltip formatter={(value) => `${value.toLocaleString('vi-VN')} VNĐ`} />
                                    <Bar dataKey="revenue" fill="#2563eb" radius={[6, 6, 0, 0]} barSize={40} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </>
            )}

            {/* 2. Giao diện riêng cho Staff (Tác vụ cá nhân đơn giản) */}
            {user.role === 'Staff' && (
                <div style={styles.cardGrid}>
                    <div style={styles.card}>
                        <div>
                            <p style={styles.cardLabel}>Đơn hàng đã lập</p>
                            <h3 style={styles.cardVal}>{stats.totalOrders || 0} Đơn</h3>
                        </div>
                        <UserCheck color="#2563eb" size={32} />
                    </div>

                    <div style={styles.card}>
                        <div>
                            <p style={styles.cardLabel}>Tác vụ chờ xử lý</p>
                            <h3 style={styles.cardVal}>2 Việc</h3>
                        </div>
                        <Clock color="#eab308" size={32} />
                    </div>

                    <div style={styles.card}>
                        <div>
                            <p style={styles.cardLabel}>Tình trạng tài khoản</p>
                            <h3 style={{ ...styles.cardVal, color: '#16a34a', fontSize: '16px' }}>Đang hoạt động</h3>
                        </div>
                        <ShieldCheck color="#16a34a" size={32} />
                    </div>
                </div>
            )}
        </div>
    );
}

const styles = {
    welcomeBanner: { backgroundColor: '#fff', padding: '20px', borderRadius: '10px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' },
    roleBadge: { backgroundColor: '#eff6ff', color: '#2563eb', padding: '4px 8px', borderRadius: '6px', fontWeight: 'bold' },
    cardGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' },
    card: { backgroundColor: '#fff', padding: '20px', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' },
    cardLabel: { fontSize: '14px', color: '#64748b', margin: 0 },
    cardVal: { fontSize: '20px', fontWeight: 'bold', margin: '5px 0 0 0', color: '#0f172a' },
    chartContainer: { backgroundColor: '#fff', padding: '20px', borderRadius: '10px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }
};