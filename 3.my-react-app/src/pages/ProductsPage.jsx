import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Edit, Trash2, Plus, X } from 'lucide-react';

export default function ProductsPage() {
    const [products, setProducts] = useState([]);
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [stock, setStock] = useState('');

    // State quản lý việc Sửa
    const [editingId, setEditingId] = useState(null);

    const fetchProducts = async () => {
        const res = await axios.get('http://localhost:5000/api/products');
        setProducts(res.data);
    };

    useEffect(() => { fetchProducts(); }, []);

    // Xử lý Thêm hoặc Cập nhật
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name || !price) return alert('Vui lòng nhập tên và giá!');

        if (editingId) {
            // 🔄 GỬI YÊU CẦU CẬP NHẬT (PUT)
            await axios.put(`http://localhost:5000/api/products/${editingId}`, { name, price: Number(price), stock: Number(stock) });
            setEditingId(null);
        } else {
            // ➕ THÊM MỚI (POST)
            await axios.post('http://localhost:5000/api/products', { name, price: Number(price), stock: Number(stock) });
        }

        setName(''); setPrice(''); setStock('');
        fetchProducts();
    };

    // Chọn sản phẩm để Sửa (đổ dữ liệu lên Form)
    const handleEditClick = (p) => {
        setEditingId(p._id);
        setName(p.name);
        setPrice(p.price);
        setStock(p.stock);
    };

    // Hủy Sửa
    const handleCancelEdit = () => {
        setEditingId(null);
        setName(''); setPrice(''); setStock('');
    };

    // Xóa
    const handleDelete = async (id) => {
        if (window.confirm('Bạn muốn xóa sản phẩm này?')) {
            await axios.delete(`http://localhost:5000/api/products/${id}`);
            fetchProducts();
        }
    };

    return (
        <div>
            <h2>📦 Quản Lý Sản Phẩm</h2>

            {/* Form Thêm / Sửa */}
            <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px', marginBottom: '20px', backgroundColor: '#fff', padding: '15px', borderRadius: '8px' }}>
                <input placeholder="Tên sản phẩm" value={name} onChange={e => setName(e.target.value)} style={{ padding: '8px', flex: 2 }} />
                <input type="number" placeholder="Giá (VNĐ)" value={price} onChange={e => setPrice(e.target.value)} style={{ padding: '8px', flex: 1 }} />
                <input type="number" placeholder="Số lượng tồn" value={stock} onChange={e => setStock(e.target.value)} style={{ padding: '8px', flex: 1 }} />

                <button type="submit" style={{ padding: '8px 16px', backgroundColor: editingId ? '#eab308' : '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
                    {editingId ? 'Cập Nhật' : 'Thêm'}
                </button>

                {editingId && (
                    <button type="button" onClick={handleCancelEdit} style={{ padding: '8px', backgroundColor: '#64748b', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
                        Hủy
                    </button>
                )}
            </form>

            {/* Bảng Danh Sách Sản Phẩm */}
            <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#fff', borderRadius: '8px' }}>
                <thead>
                    <tr style={{ backgroundColor: '#f1f5f9', textAlign: 'left' }}>
                        <th style={{ padding: '12px' }}>Tên Sản Phẩm</th>
                        <th style={{ padding: '12px' }}>Giá</th>
                        <th style={{ padding: '12px' }}>Tồn Kho</th>
                        <th style={{ padding: '12px' }}>Hành Động</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map(p => (
                        <tr key={p._id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                            <td style={{ padding: '12px' }}><b>{p.name}</b></td>
                            <td style={{ padding: '12px' }}>{p.price.toLocaleString('vi-VN')} đ</td>
                            <td style={{ padding: '12px' }}>{p.stock}</td>
                            <td style={{ padding: '12px', display: 'flex', gap: '10px' }}>
                                <button onClick={() => handleEditClick(p)} style={{ backgroundColor: '#fef08a', border: 'none', padding: '6px 10px', borderRadius: '4px', cursor: 'pointer', color: '#854d0e' }}>
                                    <Edit size={16} /> Sửa
                                </button>
                                <button onClick={() => handleDelete(p._id)} style={{ backgroundColor: '#fee2e2', border: 'none', padding: '6px 10px', borderRadius: '4px', cursor: 'pointer', color: '#991b1b' }}>
                                    <Trash2 size={16} /> Xóa
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}