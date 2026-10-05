import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ShoppingBag, Eye, RefreshCw } from 'lucide-react';

export default function OrdersPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null); // Quản lý modal xem chi tiết

    // Lấy danh sách đơn hàng
    const fetchOrders = async () => {
        try {
            setLoading(true);
            const res = await axios.get('http://localhost:5000/api/orders');
            if (res.data.success) {
                setOrders(res.data.data);
            }
        } catch (err) {
            console.error('Lỗi tải danh sách đơn hàng:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    // Cập nhật trạng thái đơn hàng
    const handleStatusChange = async (orderId, newStatus) => {
        try {
            const res = await axios.patch(`http://localhost:5000/api/orders/${orderId}/status`, {
                orderStatus: newStatus
            });
            if (res.data.success) {
                fetchOrders();
                if (selectedOrder && selectedOrder._id === orderId) {
                    setSelectedOrder(res.data.data);
                }
            }
        } catch (err) {
            alert(err.response?.data?.message || 'Không thể cập nhật trạng thái!');
        }
    };

    // Style badge màu cho từng trạng thái
    const getStatusBadge = (status) => {
        const styles = {
            pending: { bg: '#fef3c7', color: '#d97706', label: 'Chờ xác nhận' },
            confirmed: { bg: '#e0f2fe', color: '#0284c7', label: 'Đã xác nhận' },
            packing: { bg: '#f3e8ff', color: '#9333ea', label: 'Đang đóng gói' },
            shipping: { bg: '#e0e7ff', color: '#4f46e5', label: 'Đang giao hàng' },
            delivered: { bg: '#dcfce7', color: '#15803d', label: 'Đã giao thành công' },
            cancelled: { bg: '#fee2e2', color: '#b91c1c', label: 'Đã hủy' }
        };
        const current = styles[status] || { bg: '#f1f5f9', color: '#475569', label: status };
        return (
            <span style={{ backgroundColor: current.bg, color: current.color, padding: '4px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold' }}>
                {current.label}
            </span>
        );
    };

    return (
        <div style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ color: '#1e293b', margin: 0 }}>🛒 Quản Lý Đơn Hàng (Luxury Boutique)</h2>
                <button onClick={fetchOrders} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', backgroundColor: '#fff', border: '1px solid #cbd5e1', borderRadius: '6px', cursor: 'pointer' }}>
                    <RefreshCw size={16} /> Làm mới
                </button>
            </div>

            {/* Bảng Danh Sách Đơn Hàng */}
            {loading ? (
                <p>Đang tải danh sách đơn hàng...</p>
            ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#fff', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                    <thead>
                        <tr style={{ backgroundColor: '#f8fafc', textAlign: 'left', borderBottom: '2px solid #e2e8f0' }}>
                            <th style={{ padding: '14px' }}>Mã Đơn</th>
                            <th style={{ padding: '14px' }}>Khách Hàng</th>
                            <th style={{ padding: '14px' }}>Số Điện Thoại</th>
                            <th style={{ padding: '14px' }}>Tổng Tiền</th>
                            <th style={{ padding: '14px' }}>Trạng Thái</th>
                            <th style={{ padding: '14px' }}>Ngày Đặt</th>
                            <th style={{ padding: '14px' }}>Hành Động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.length === 0 ? (
                            <tr>
                                <td colSpan="7" style={{ padding: '20px', textAlign: 'center', color: '#64748b' }}>Chưa có đơn hàng nào phát sinh.</td>
                            </tr>
                        ) : (
                            orders.map((o) => (
                                <tr key={o._id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                                    <td style={{ padding: '14px', fontWeight: 'bold', color: '#2563eb' }}>{o.orderNumber || o._id.substring(0, 8)}</td>
                                    <td style={{ padding: '14px' }}><b>{o.customerInfo?.fullName || 'N/A'}</b></td>
                                    <td style={{ padding: '14px' }}>{o.customerInfo?.phone || 'N/A'}</td>
                                    <td style={{ padding: '14px', color: '#16a34a', fontWeight: 'bold' }}>
                                        {o.totalAmount ? o.totalAmount.toLocaleString('vi-VN') + ' VNĐ' : '0 VNĐ'}
                                    </td>
                                    <td style={{ padding: '14px' }}>{getStatusBadge(o.orderStatus)}</td>
                                    <td style={{ padding: '14px', fontSize: '13px', color: '#64748b' }}>
                                        {new Date(o.createdAt).toLocaleString('vi-VN')}
                                    </td>
                                    <td style={{ padding: '14px', display: 'flex', gap: '8px', alignItems: 'center' }}>
                                        {/* Dropdown Đổi Trạng Thái nhanh */}
                                        <select
                                            value={o.orderStatus}
                                            onChange={(e) => handleStatusChange(o._id, e.target.value)}
                                            style={{ padding: '6px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '12px' }}
                                        >
                                            <option value="pending">Chờ xác nhận</option>
                                            <option value="confirmed">Xác nhận</option>
                                            <option value="packing">Đóng gói</option>
                                            <option value="shipping">Đang giao</option>
                                            <option value="delivered">Đã giao</option>
                                            <option value="cancelled">Hủy đơn</option>
                                        </select>

                                        <button
                                            onClick={() => setSelectedOrder(o)}
                                            style={{ display: 'flex', alignItems: 'center', gap: '4px', backgroundColor: '#e2e8f0', border: 'none', padding: '6px 10px', borderRadius: '4px', cursor: 'pointer' }}
                                        >
                                            <Eye size={14} /> Chi tiết
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            )}

            {/* Modal Xem Chi Tiết Đơn Hàng */}
            {selectedOrder && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                    <div style={{ backgroundColor: '#fff', padding: '24px', borderRadius: '8px', width: '600px', maxHeight: '80vh', overflowY: 'auto' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px' }}>
                            <h3 style={{ margin: 0 }}>Chi Tiết Đơn Hàng: {selectedOrder.orderNumber}</h3>
                            <button onClick={() => setSelectedOrder(null)} style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: '16px' }}>✖</button>
                        </div>

                        <div style={{ marginBottom: '16px', fontSize: '14px' }}>
                            <p><b>Khách hàng:</b> {selectedOrder.customerInfo?.fullName}</p>
                            <p><b>Số điện thoại:</b> {selectedOrder.customerInfo?.phone}</p>
                            <p><b>Email:</b> {selectedOrder.customerInfo?.email}</p>
                            <p><b>Địa chỉ giao:</b> {`${selectedOrder.customerInfo?.address?.street || ''}, ${selectedOrder.customerInfo?.address?.city || ''}`}</p>
                            <p><b>Phương thức thanh toán:</b> {selectedOrder.paymentMethod}</p>
                        </div>

                        <h4>Danh sách món hàng:</h4>
                        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '16px' }}>
                            <thead>
                                <tr style={{ backgroundColor: '#f1f5f9', textAlign: 'left' }}>
                                    <th style={{ padding: '8px' }}>Sản phẩm</th>
                                    <th style={{ padding: '8px' }}>Size/Màu</th>
                                    <th style={{ padding: '8px' }}>Đơn giá</th>
                                    <th style={{ padding: '8px' }}>SL</th>
                                </tr>
                            </thead>
                            <tbody>
                                {selectedOrder.items?.map((item, idx) => (
                                    <tr key={idx} style={{ borderBottom: '1px solid #eee' }}>
                                        <td style={{ padding: '8px' }}>{item.productName}</td>
                                        <td style={{ padding: '8px' }}>{`${item.attributes?.size || ''} / ${item.attributes?.color || ''}`}</td>
                                        <td style={{ padding: '8px' }}>{item.priceAtPurchase?.toLocaleString('vi-VN')} đ</td>
                                        <td style={{ padding: '8px' }}>{item.quantity}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <div style={{ textAlign: 'right', fontWeight: 'bold', fontSize: '16px', color: '#16a34a' }}>
                            Tổng tiền thanh toán: {selectedOrder.totalAmount?.toLocaleString('vi-VN')} VNĐ
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}