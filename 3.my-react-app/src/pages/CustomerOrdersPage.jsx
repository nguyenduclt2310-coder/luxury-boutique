import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ShoppingBag, Clock, CheckCircle2, Truck, PackageX } from 'lucide-react';

export default function CustomerOrdersPage() {
    const [orders, setOrders] = useState([]);
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    useEffect(() => {
        // Tải danh sách đơn hàng của riêng khách hàng này
        axios.get(`http://localhost:5000/api/orders?phone=${user.phone || ''}`)
            .then(res => setOrders(res.data))
            .catch(err => console.error('Lỗi tải đơn hàng:', err));
    }, [user.phone]);

    const getStatusBadge = (status) => {
        switch (status) {
            case 'Completed': return <span style={styles.badgeSuccess}><CheckCircle2 size={14} /> Đã hoàn thành</span>;
            case 'Shipping': return <span style={styles.badgeInfo}><Truck size={14} /> Đang giao hàng</span>;
            case 'Cancelled': return <span style={styles.badgeDanger}><PackageX size={14} /> Đã hủy</span>;
            default: return <span style={styles.badgeWarning}><Clock size={14} /> Chờ xử lý</span>;
        }
    };

    return (
        <div style={styles.container}>
            <h2><ShoppingBag color="#2563eb" /> Lịch Sử Đơn Hàng Của Tôi</h2>
            <p style={{ color: '#64748b' }}>Xin chào <b>{user.name}</b>, dưới đây là danh sách các đơn hàng bạn đã đặt:</p>

            <div style={styles.orderList}>
                {orders.length === 0 ? (
                    <div style={styles.empty}>Bạn chưa có đơn hàng nào. Hãy ghé Cửa hàng để trải nghiệm mua sắm!</div>
                ) : (
                    orders.map(order => (
                        <div key={order._id} style={styles.orderCard}>
                            <div style={styles.cardHeader}>
                                <div>
                                    <strong>Mã đơn: #{order._id.substring(18)}</strong>
                                    <div style={{ fontSize: '12px', color: '#64748b' }}>
                                        Ngày đặt: {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                                    </div>
                                </div>
                                {getStatusBadge(order.status)}
                            </div>

                            <div style={styles.itemList}>
                                {order.items?.map((item, idx) => (
                                    <div key={idx} style={styles.itemRow}>
                                        <span>{item.productName} x{item.quantity}</span>
                                        <span>{(item.price * item.quantity).toLocaleString('vi-VN')} đ</span>
                                    </div>
                                ))}
                            </div>

                            <div style={styles.cardFooter}>
                                <span>Tổng tiền:</span>
                                <strong style={{ color: '#2563eb', fontSize: '16px' }}>
                                    {(order.totalAmount || 0).toLocaleString('vi-VN')} VNĐ
                                </strong>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

const styles = {
    container: { maxWidth: '800px', margin: '0 auto', padding: '24px', fontFamily: "'Segoe UI', sans-serif" },
    orderList: { display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '20px' },
    orderCard: { backgroundColor: '#fff', padding: '16px', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.08)', border: '1px solid #e2e8f0' },
    cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '12px', borderBottom: '1px solid #f1f5f9' },
    itemList: { padding: '12px 0' },
    itemRow: { display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#334155', marginBottom: '6px' },
    cardFooter: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px', borderTop: '1px dashed #e2e8f0' },
    empty: { textAlign: 'center', padding: '40px', backgroundColor: '#fff', borderRadius: '12px', color: '#64748b' },
    badgeSuccess: { backgroundColor: '#dcfce7', color: '#15803d', padding: '4px 8px', borderRadius: '6px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' },
    badgeWarning: { backgroundColor: '#fef3c7', color: '#b45309', padding: '4px 8px', borderRadius: '6px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' },
    badgeInfo: { backgroundColor: '#e0f2fe', color: '#0369a1', padding: '4px 8px', borderRadius: '6px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' },
    badgeDanger: { backgroundColor: '#fee2e2', color: '#b91c1c', padding: '4px 8px', borderRadius: '6px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }
};