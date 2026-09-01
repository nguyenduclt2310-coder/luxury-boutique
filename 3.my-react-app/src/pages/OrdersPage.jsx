import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Plus, ShoppingBag } from 'lucide-react';

export default function OrdersPage() {
    const [orders, setOrders] = useState([]);
    const [customerName, setCustomerName] = useState('');
    const [totalAmount, setTotalAmount] = useState('');

    const fetchOrders = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/orders');
            setOrders(res.data);
        } catch (err) {
            console.error('Lỗi tải đơn hàng:', err);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleCreateOrder = async (e) => {
        e.preventDefault();
        if (!customerName || !totalAmount) return alert('Vui lòng nhập tên khách và số tiền!');

        try {
            await axios.post('http://localhost:5000/api/orders', {
                customerName,
                totalAmount: Number(totalAmount),
                status: 'Completed'
            });
            setCustomerName('');
            setTotalAmount('');
            fetchOrders();
            alert('Tạo đơn hàng thành công! Doanh thu đã được ghi nhận.');
        } catch (err) {
            console.error('Lỗi tạo đơn hàng:', err);
        }
    };

    return (
        <div>
            <h2>🛒 Quản Lý Đơn Hàng (Tạo Doanh Thu Real-time)</h2>

            {/* Form Tạo Đơn Hàng */}
            <form onSubmit={handleCreateOrder} style={{ display: 'flex', gap: '10px', marginBottom: '20px', backgroundColor: '#fff', padding: '15px', borderRadius: '8px' }}>
                <input placeholder="Tên khách hàng" value={customerName} onChange={e => setCustomerName(e.target.value)} style={{ padding: '8px', flex: 1 }} />
                <input type="number" placeholder="Tổng tiền đơn (VNĐ)" value={totalAmount} onChange={e => setTotalAmount(e.target.value)} style={{ padding: '8px', flex: 1 }} />
                <button type="submit" style={{ padding: '8px 16px', backgroundColor: '#16a34a', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Plus size={16} /> Bán Đơn Mới
                </button>
            </form>

            {/* Bảng Đơn Hàng */}
            <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#fff', borderRadius: '8px' }}>
                <thead>
                    <tr style={{ backgroundColor: '#f1f5f9', textAlign: 'left' }}>
                        <th style={{ padding: '12px' }}>Mã Đơn</th>
                        <th style={{ padding: '12px' }}>Khách Hàng</th>
                        <th style={{ padding: '12px' }}>Số Tiền</th>
                        <th style={{ padding: '12px' }}>Trạng Thái</th>
                        <th style={{ padding: '12px' }}>Ngày Tạo</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map((o) => (
                        <tr key={o._id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                            <td style={{ padding: '12px' }}>{o._id.substring(0, 8)}...</td>
                            <td style={{ padding: '12px' }}><b>{o.customerName}</b></td>
                            <td style={{ padding: '12px', color: '#16a34a', fontWeight: 'bold' }}>{o.totalAmount.toLocaleString('vi-VN')} VNĐ</td>
                            <td style={{ padding: '12px' }}><span style={{ backgroundColor: '#dcfce7', color: '#15803d', padding: '4px 8px', borderRadius: '4px', fontSize: '12px' }}>{o.status}</span></td>
                            <td style={{ padding: '12px' }}>{new Date(o.createdAt).toLocaleDateString('vi-VN')}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}