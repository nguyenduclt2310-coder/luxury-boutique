import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
    Search,
    Plus,
    Trash2,
    RefreshCw,
    Edit,
    Eye,
    ChevronLeft,
    ChevronRight,
    X,
    Save,
    Image as ImageIcon,
    ChevronDown,
    Check,
    FolderTree,
    Tag,
    Download,
    Upload,
    Percent,
    Clock,
    Boxes,
    Layers,
    Sparkles
} from 'lucide-react';

const SUGGESTED_CATEGORIES = [
    'Thời trang Nam', 'Thời trang Nữ', 'Áo Sơ Mi', 'Áo T-Shirt / Polo',
    'Quần Tây / Khaki', 'Quần Jeans', 'Đầm Dạ Hội', 'Phụ Kiện Cao Cấp'
];

const SUGGESTED_COLLECTIONS = [
    'BST Thu Đông 2026', 'BST Xuân Hè 2026', 'Capsule Collection',
    'Luxury Office Wear', 'Limited Edition 2026'
];

const SUGGESTED_TAGS = ['New Arrival', 'Best Seller', 'Limited Edition', 'Hot Sale', 'Silk Premium'];

export default function ProductsPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const queryParams = new URLSearchParams(location.search);
    const activeTab = queryParams.get('tab') || 'list';

    // State Danh Sách & Phân Trang
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('active');
    const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });

    // State Cây Danh Mục
    const [categoriesList, setCategoriesList] = useState([]);
    const [newCatName, setNewCatName] = useState('');
    const [newCatParent, setNewCatParent] = useState('');

    // State Điều Chỉnh Kho (Nhập / Xuất Kho)
    const [stockModalItem, setStockModalItem] = useState(null);
    const [stockAdjustType, setStockAdjustType] = useState('IMPORT');
    const [stockAdjustQty, setStockAdjustQty] = useState('');
    const [stockAdjustReason, setStockAdjustReason] = useState('Nhập hàng bổ sung từ xưởng');

    // State Cấu Hình Flash Sale
    const [selectedPromoProduct, setSelectedPromoProduct] = useState(null);
    const [promoSalePrice, setPromoSalePrice] = useState('');
    const [promoPercent, setPromoPercent] = useState('');
    const [promoEnd, setPromoEnd] = useState('');

    // State Form Thêm / Sửa Sản Phẩm
    const [editingId, setEditingId] = useState(null);
    const [name, setName] = useState('');
    const [basePrice, setBasePrice] = useState('');
    const [salePrice, setSalePrice] = useState('');
    const [flashSaleEnd, setFlashSaleEnd] = useState('');
    const [brand, setBrand] = useState('Luxury Boutique');
    const [category, setCategory] = useState('Thời trang Nam');
    const [collectionName, setCollectionName] = useState('BST Thu Đông 2026');
    const [selectedTags, setSelectedTags] = useState(['New Arrival', 'Best Seller']);
    const [description, setDescription] = useState('');
    const [sizeChart, setSizeChart] = useState({ shoulder: '42cm', chest: '96cm', length: '70cm' });
    const [imageInputs, setImageInputs] = useState(['']);
    const [variants, setVariants] = useState([{ size: 'M', color: 'Đen', price: '', stock: 10 }]);

    // Custom Dropdown UI States
    const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
    const [showCollectionDropdown, setShowCollectionDropdown] = useState(false);
    const [showTagDropdown, setShowTagDropdown] = useState(false);

    const categoryRef = useRef(null);
    const collectionRef = useRef(null);
    const tagRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (categoryRef.current && !categoryRef.current.contains(event.target)) setShowCategoryDropdown(false);
            if (collectionRef.current && !collectionRef.current.contains(event.target)) setShowCollectionDropdown(false);
            if (tagRef.current && !tagRef.current.contains(event.target)) setShowTagDropdown(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Fetch Danh Sách Sản Phẩm Tới API
    const fetchProducts = async (page = 1) => {
        try {
            setLoading(true);
            const res = await axios.get('http://localhost:5000/api/products', {
                params: { search, status: statusFilter, page, limit: 8 }
            });
            if (res.data.success) {
                setProducts(res.data.data);
                setPagination(res.data.pagination);
            }
        } catch (err) {
            console.error('Lỗi tải sản phẩm:', err);
        } finally {
            setLoading(false);
        }
    };

    // Fetch Cây Danh Mục Tới API
    const fetchCategories = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/products/categories/all');
            if (res.data.success) setCategoriesList(res.data.data);
        } catch (err) {
            console.error('Lỗi tải danh mục:', err);
        }
    };

    useEffect(() => {
        fetchProducts(pagination.page);
        fetchCategories();
    }, [search, statusFilter, activeTab]);

    const resetForm = () => {
        setEditingId(null);
        setName('');
        setBasePrice('');
        setSalePrice('');
        setFlashSaleEnd('');
        setBrand('Luxury Boutique');
        setCategory('Thời trang Nam');
        setCollectionName('BST Thu Đông 2026');
        setSelectedTags(['New Arrival', 'Best Seller']);
        setDescription('');
        setSizeChart({ shoulder: '', chest: '', length: '' });
        setImageInputs(['']);
        setVariants([{ size: 'M', color: 'Đen', price: '', stock: 10 }]);
    };

    // Thao tác mảng Tags
    const handleTagToggle = (tag) => {
        if (selectedTags.includes(tag)) {
            setSelectedTags(selectedTags.filter((t) => t !== tag));
        } else {
            setSelectedTags([...selectedTags, tag]);
        }
    };

    // Thao tác mảng Ảnh
    const handleAddImageInput = () => setImageInputs([...imageInputs, '']);
    const handleRemoveImageInput = (idx) => setImageInputs(imageInputs.filter((_, i) => i !== idx));
    const handleImageInputChange = (idx, value) => {
        const updated = [...imageInputs];
        updated[idx] = value;
        setImageInputs(updated);
    };

    // Thao tác Mảng Biến Thể
    const handleAddVariantRow = () => setVariants([...variants, { size: 'L', color: 'Trắng', price: basePrice || '', stock: 10 }]);
    const handleRemoveVariantRow = (idx) => setVariants(variants.filter((_, i) => i !== idx));
    const handleVariantChange = (idx, field, value) => {
        const updated = [...variants];
        updated[idx][field] = value;
        setVariants(updated);
    };

    // Submit Form (Tạo Mới / Cập Nhật Sản Phẩm)
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name || !basePrice) return alert('Vui lòng nhập tên và giá niêm yết!');

        const filteredImages = imageInputs.filter((url) => url.trim() !== '');

        const payload = {
            name,
            basePrice: Number(basePrice),
            salePrice: salePrice ? Number(salePrice) : null,
            flashSaleEnd: flashSaleEnd || null,
            brand,
            category,
            collectionName,
            tags: selectedTags,
            description,
            sizeChart,
            images: filteredImages.length > 0 ? filteredImages : ['https://via.placeholder.com/300'],
            variants
        };

        try {
            if (editingId) {
                await axios.put(`http://localhost:5000/api/products/${editingId}`, payload);
                alert('Cập nhật sản phẩm thành công!');
            } else {
                await axios.post('http://localhost:5000/api/products', payload);
                alert('Tạo sản phẩm mới thành công!');
            }
            resetForm();
            navigate('/products?tab=list');
        } catch (err) {
            alert(err.response?.data?.message || 'Có lỗi xảy ra!');
        }
    };

    // Xử Lý Nhập / Xuất Kho
    const handleStockAdjustment = async () => {
        if (!stockAdjustQty || Number(stockAdjustQty) <= 0) return alert('Số lượng nhập/xuất không hợp lệ!');
        try {
            const res = await axios.post('http://localhost:5000/api/products/stock-adjustment', {
                variantId: stockModalItem.variantId,
                type: stockAdjustType,
                quantity: stockAdjustQty,
                reason: stockAdjustReason
            });
            if (res.data.success) {
                alert(res.data.message);
                setStockModalItem(null);
                setStockAdjustQty('');
                fetchProducts(pagination.page);
            }
        } catch (err) {
            alert(err.response?.data?.message || 'Có lỗi điều chỉnh kho!');
        }
    };

    // Xử Lý Tạo Danh Mục Mới
    const handleAddCategory = async (e) => {
        e.preventDefault();
        if (!newCatName) return alert('Vui lòng nhập tên danh mục!');
        try {
            await axios.post('http://localhost:5000/api/products/categories', {
                name: newCatName,
                parentId: newCatParent || null
            });
            alert('Tạo danh mục mới thành công!');
            setNewCatName('');
            fetchCategories();
        } catch (err) {
            alert('Lỗi tạo danh mục!');
        }
    };

    // Xử Lý Cấu Hình Flash Sale
    const handleSavePromo = async () => {
        if (!selectedPromoProduct) return;
        try {
            await axios.put(`http://localhost:5000/api/products/${selectedPromoProduct._id}/promotional`, {
                salePrice: promoSalePrice,
                discountPercent: promoPercent,
                flashSaleEnd: promoEnd
            });
            alert('Cập nhật Flash Sale thành công!');
            setSelectedPromoProduct(null);
            fetchProducts(pagination.page);
        } catch (err) {
            alert('Có lỗi khi cập nhật khuyến mãi!');
        }
    };

    return (
        <div style={containerStyle}>
            {/* HEADER TỔNG THỂ */}
            <div style={headerContainerStyle}>
                <div>
                    <h1 style={titleStyle}>
                        {activeTab === 'list' && '📦 Quản Lý Kho & Kiểm Kê Hàng Hóa ERP'}
                        {activeTab === 'add' && (editingId ? '✏️ Chỉnh Sửa Sản Phẩm' : '➕ Thêm Sản Phẩm Mới')}
                        {activeTab === 'categories' && '📂 Quản Lý Cây Danh Mục & BST'}
                        {activeTab === 'promotional' && '🏷️ Thiết Lập Flash Sale & Giá Giảm'}
                        {activeTab === 'excel' && '📊 Import / Export Excel Kho Hàng'}
                    </h1>
                    <p style={subtitleStyle}>Hệ thống vận hành chuỗi cung ứng & quản trị sản phẩm tập trung</p>
                </div>

                {activeTab === 'list' ? (
                    <button onClick={() => { resetForm(); navigate('/products?tab=add'); }} style={btnPrimaryStyle}>
                        <Plus size={18} /> Thêm Sản Phẩm Mới
                    </button>
                ) : (
                    <button onClick={() => { resetForm(); navigate('/products?tab=list'); }} style={btnSecondaryStyle}>
                        <X size={18} /> Hủy & Quay Lại
                    </button>
                )}
            </div>

            {/* ================= TAB 1: DANH SÁCH & TỒN KHO ================= */}
            {activeTab === 'list' && (
                <>
                    <div style={filterBarContainerStyle}>
                        <div style={{ position: 'relative', flex: 1, minWidth: '280px' }}>
                            <Search size={18} style={searchIconStyle} />
                            <input
                                type="text"
                                placeholder="Tìm sản phẩm theo tên, mã SKU, tag..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                style={searchInputStyle}
                            />
                        </div>

                        <div style={{ display: 'flex', gap: '10px' }}>
                            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={selectModernStyle}>
                                <option value="active">🟢 Đang kinh doanh</option>
                                <option value="archived">🔴 Đã ẩn / Lưu trữ</option>
                                <option value="all">📋 Tất cả sản phẩm</option>
                            </select>

                            <button onClick={() => fetchProducts(1)} style={btnSecondaryStyle}>
                                <RefreshCw size={16} /> Tải Lại
                            </button>
                        </div>
                    </div>

                    <div style={tableWrapperStyle}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                            <thead>
                                <tr style={tableHeaderRowStyle}>
                                    <th style={thStyle}>Hình Ảnh</th>
                                    <th style={thStyle}>Tên Sản Phẩm & Phân Loại</th>
                                    <th style={thStyle}>Giá Niêm Yết / Sale</th>
                                    <th style={thStyle}>Biến Thể & Nhập Xuất Kho</th>
                                    <th style={thStyle}>Tổng Tồn Kho</th>
                                    <th style={thStyle}>Hành Động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr><td colSpan="6" style={{ padding: '30px', textAlign: 'center' }}>Đang tải dữ liệu kho hàng...</td></tr>
                                ) : products.length === 0 ? (
                                    <tr><td colSpan="6" style={{ padding: '30px', textAlign: 'center', color: '#94a3b8' }}>Không tìm thấy sản phẩm nào trong kho.</td></tr>
                                ) : (
                                    products.map((p) => {
                                        const totalStock = p.variants?.reduce((sum, v) => sum + (v.stock || 0), 0) || 0;
                                        return (
                                            <tr key={p._id} style={tableRowStyle}>
                                                <td style={tdStyle}>
                                                    <img src={p.images?.[0] || 'https://via.placeholder.com/50'} alt={p.name} style={productImgStyle} />
                                                </td>
                                                <td style={tdStyle}>
                                                    <div style={{ fontWeight: '600', color: '#0f172a' }}>{p.name}</div>
                                                    <div style={{ fontSize: '12px', color: '#64748b' }}>{p.category} • {p.collectionName || 'Chưa gắn BST'}</div>
                                                    <div style={{ display: 'flex', gap: '4px', marginTop: '4px', flexWrap: 'wrap' }}>
                                                        {p.tags?.map((t, i) => (
                                                            <span key={i} style={badgeStyle}>#{t}</span>
                                                        ))}
                                                    </div>
                                                </td>
                                                <td style={tdStyle}>
                                                    <div style={{ color: p.salePrice ? '#94a3b8' : '#059669', textDecoration: p.salePrice ? 'line-through' : 'none', fontWeight: '600' }}>
                                                        {p.basePrice?.toLocaleString('vi-VN')} đ
                                                    </div>
                                                    {p.salePrice && (
                                                        <div style={{ color: '#dc2626', fontWeight: '700', fontSize: '13px' }}>
                                                            🔥 {p.salePrice?.toLocaleString('vi-VN')} đ
                                                        </div>
                                                    )}
                                                </td>
                                                <td style={tdStyle}>
                                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                                        {p.variants?.map((v) => (
                                                            <div key={v._id} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                                <span style={variantPillStyle}>{v.attributes?.size} / {v.attributes?.color} (Tồn: {v.stock})</span>
                                                                <button
                                                                    onClick={() => setStockModalItem({ productId: p._id, productName: p.name, variantId: v._id, variantName: `${v.attributes?.size}/${v.attributes?.color}`, currentStock: v.stock })}
                                                                    style={btnStockActionStyle}
                                                                >
                                                                    <Boxes size={12} /> Nhập/Xuất Kho
                                                                </button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </td>
                                                <td style={tdStyle}>
                                                    <span style={{ fontWeight: '700', color: totalStock < 5 ? '#dc2626' : '#0f172a' }}>
                                                        {totalStock} {totalStock < 5 && <span style={{ fontSize: '11px', color: '#dc2626' }}>(Thấp)</span>}
                                                    </span>
                                                </td>
                                                <td style={tdStyle}>
                                                    <div style={{ display: 'flex', gap: '6px' }}>
                                                        <button onClick={() => navigate('/products?tab=add')} style={btnIconEditStyle} title="Chỉnh Sửa"><Edit size={15} /></button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>

                        {/* Phân Trang */}
                        {pagination.pages > 1 && (
                            <div style={paginationContainerStyle}>
                                <span style={{ fontSize: '13px', color: '#64748b' }}>Trang {pagination.page} trên {pagination.pages}</span>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <button disabled={pagination.page === 1} onClick={() => fetchProducts(pagination.page - 1)} style={btnSecondaryStyle}>
                                        <ChevronLeft size={16} /> Trước
                                    </button>
                                    <button disabled={pagination.page === pagination.pages} onClick={() => fetchProducts(pagination.page + 1)} style={btnSecondaryStyle}>
                                        Sau <ChevronRight size={16} />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </>
            )}

            {/* ================= TAB 2: FORM THÊM / SỬA ================= */}
            {activeTab === 'add' && (
                <div style={formCardStyle}>
                    <form onSubmit={handleSubmit}>
                        <div style={formGrid2Style}>
                            <div>
                                <label style={labelStyle}>Tên Sản Phẩm *</label>
                                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ví dụ: Áo Sơ Mi Lụa Premium" required style={inputModernStyle} />
                            </div>
                            <div>
                                <label style={labelStyle}>Giá Niêm Yết (VNĐ) *</label>
                                <input type="number" value={basePrice} onChange={(e) => setBasePrice(e.target.value)} placeholder="1500000" required style={inputModernStyle} />
                            </div>
                        </div>

                        <div style={formGrid3Style}>
                            {/* Dropdown gợi ý Danh mục */}
                            <div style={{ position: 'relative' }} ref={categoryRef}>
                                <label style={labelStyle}>Danh Mục Sản Phẩm</label>
                                <div style={{ position: 'relative' }}>
                                    <input
                                        type="text"
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                        onFocus={() => setShowCategoryDropdown(true)}
                                        placeholder="Chọn hoặc nhập danh mục..."
                                        style={inputModernStyle}
                                    />
                                    <ChevronDown size={16} style={dropdownArrowStyle} onClick={() => setShowCategoryDropdown(!showCategoryDropdown)} />
                                </div>
                                {showCategoryDropdown && (
                                    <div style={dropdownMenuCustomStyle}>
                                        {SUGGESTED_CATEGORIES.map((cat, idx) => (
                                            <div key={idx} onClick={() => { setCategory(cat); setShowCategoryDropdown(false); }} style={dropdownItemStyle}>
                                                {cat} {category === cat && <Check size={14} color="#2563eb" />}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Dropdown gợi ý Bộ sưu tập */}
                            <div style={{ position: 'relative' }} ref={collectionRef}>
                                <label style={labelStyle}>Bộ Sưu Tập (Seasonal Collection)</label>
                                <div style={{ position: 'relative' }}>
                                    <input
                                        type="text"
                                        value={collectionName}
                                        onChange={(e) => setCollectionName(e.target.value)}
                                        onFocus={() => setShowCollectionDropdown(true)}
                                        placeholder="Chọn bộ sưu tập..."
                                        style={inputModernStyle}
                                    />
                                    <ChevronDown size={16} style={dropdownArrowStyle} onClick={() => setShowCollectionDropdown(!showCollectionDropdown)} />
                                </div>
                                {showCollectionDropdown && (
                                    <div style={dropdownMenuCustomStyle}>
                                        {SUGGESTED_COLLECTIONS.map((col, idx) => (
                                            <div key={idx} onClick={() => { setCollectionName(col); setShowCollectionDropdown(false); }} style={dropdownItemStyle}>
                                                {col} {collectionName === col && <Check size={14} color="#2563eb" />}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Dropdown gợi ý Nhãn thẻ Tags */}
                            <div style={{ position: 'relative' }} ref={tagRef}>
                                <label style={labelStyle}>Nhãn Thẻ Phân Loại (Tags)</label>
                                <div style={{ position: 'relative' }}>
                                    <div onClick={() => setShowTagDropdown(!showTagDropdown)} style={{ ...inputModernStyle, cursor: 'pointer', display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '4px', minHeight: '42px' }}>
                                        {selectedTags.length === 0 && <span style={{ color: '#94a3b8' }}>Chọn nhãn tag...</span>}
                                        {selectedTags.map((t, idx) => (
                                            <span key={idx} style={tagBadgeSelectStyle}>
                                                #{t} <X size={12} onClick={(e) => { e.stopPropagation(); handleTagToggle(t); }} />
                                            </span>
                                        ))}
                                    </div>
                                    <ChevronDown size={16} style={dropdownArrowStyle} />
                                </div>
                                {showTagDropdown && (
                                    <div style={dropdownMenuCustomStyle}>
                                        {SUGGESTED_TAGS.map((tag, idx) => (
                                            <div key={idx} onClick={() => handleTagToggle(tag)} style={dropdownItemStyle}>
                                                <span>#{tag}</span>
                                                {selectedTags.includes(tag) && <Check size={14} color="#2563eb" />}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* BẢNG SIZE CHART */}
                        <div style={subFormBlockStyle}>
                            <label style={{ ...labelStyle, display: 'flex', alignItems: 'center', gap: '6px' }}>📐 Thông Số Kỹ Thuật & Bảng Size Guide</label>
                            <div style={{ display: 'flex', gap: '12px' }}>
                                <input type="text" placeholder="Rộng vai (vd: 42cm)" value={sizeChart.shoulder} onChange={(e) => setSizeChart({ ...sizeChart, shoulder: e.target.value })} style={{ ...inputModernStyle, flex: 1 }} />
                                <input type="text" placeholder="Vòng ngực (vd: 96cm)" value={sizeChart.chest} onChange={(e) => setSizeChart({ ...sizeChart, chest: e.target.value })} style={{ ...inputModernStyle, flex: 1 }} />
                                <input type="text" placeholder="Chiều dài (vd: 70cm)" value={sizeChart.length} onChange={(e) => setSizeChart({ ...sizeChart, length: e.target.value })} style={{ ...inputModernStyle, flex: 1 }} />
                            </div>
                        </div>

                        {/* BỘ SỰ TẬP ẢNH */}
                        <div style={subFormBlockStyle}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                <label style={{ ...labelStyle, margin: 0 }}><ImageIcon size={16} /> URL Hình Ảnh Đại Diện & Gallery</label>
                                <button type="button" onClick={handleAddImageInput} style={btnSmallStyle}>+ Thêm Ô Nhập Ảnh</button>
                            </div>
                            {imageInputs.map((url, idx) => (
                                <div key={idx} style={{ display: 'flex', gap: '10px', marginBottom: '8px' }}>
                                    <input type="text" placeholder="https://..." value={url} onChange={(e) => handleImageInputChange(idx, e.target.value)} style={{ ...inputModernStyle, flex: 1 }} />
                                    {imageInputs.length > 1 && (
                                        <button type="button" onClick={() => handleRemoveImageInput(idx)} style={{ color: '#ef4444', border: 'none', background: 'none', cursor: 'pointer' }}><X size={18} /></button>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* MẢNG BIẾN THỂ */}
                        <div style={subFormBlockStyle}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                                <label style={{ ...labelStyle, margin: 0 }}>Cấu Hình Biến Thể Kho (Size / Màu / Tồn Kho)</label>
                                <button type="button" onClick={handleAddVariantRow} style={btnSmallStyle}>+ Thêm Biến Thể</button>
                            </div>

                            {variants.map((v, idx) => (
                                <div key={idx} style={{ display: 'flex', gap: '10px', marginBottom: '8px' }}>
                                    <input type="text" placeholder="Size (S, M, L)" value={v.size} onChange={(e) => handleVariantChange(idx, 'size', e.target.value)} style={{ ...inputModernStyle, flex: 1 }} />
                                    <input type="text" placeholder="Màu sắc" value={v.color} onChange={(e) => handleVariantChange(idx, 'color', e.target.value)} style={{ ...inputModernStyle, flex: 1 }} />
                                    <input type="number" placeholder="Số lượng tồn" value={v.stock} onChange={(e) => handleVariantChange(idx, 'stock', e.target.value)} style={{ ...inputModernStyle, flex: 1 }} />
                                    {variants.length > 1 && (
                                        <button type="button" onClick={() => handleRemoveVariantRow(idx)} style={{ color: '#ef4444', border: 'none', background: 'none', cursor: 'pointer' }}><X size={18} /></button>
                                    )}
                                </div>
                            ))}
                        </div>

                        <button type="submit" style={btnSubmitFullStyle}>
                            <Save size={18} /> {editingId ? 'Cập Nhật Sản Phẩm' : 'Lưu Sản Phẩm Mới'}
                        </button>
                    </form>
                </div>
            )}

            {/* ================= TAB 3: QUẢN LÝ CÂY DANH MỤC ================= */}
            {activeTab === 'categories' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px' }}>
                    <div style={formCardStyle}>
                        <h3 style={{ margin: '0 0 16px', fontSize: '16px', color: '#0f172a' }}>➕ Tạo Danh Mục Hàng Hóa Mới</h3>
                        <form onSubmit={handleAddCategory} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                            <div>
                                <label style={labelStyle}>Tên Danh Mục *</label>
                                <input type="text" placeholder="Ví dụ: Áo Sơ Mi Nam" value={newCatName} onChange={(e) => setNewCatName(e.target.value)} required style={inputModernStyle} />
                            </div>

                            <div>
                                <label style={labelStyle}>Chọn Danh Mục Cấp Cha</label>
                                <select value={newCatParent} onChange={(e) => setNewCatParent(e.target.value)} style={inputModernStyle}>
                                    <option value="">Không (Mức danh mục gốc)</option>
                                    {categoriesList.filter(c => !c.parentId).map((c) => (
                                        <option key={c.id} value={c.id}>📂 {c.name}</option>
                                    ))}
                                </select>
                            </div>

                            <button type="submit" style={btnPrimaryStyle}>
                                <Save size={16} /> Lưu Danh Mục Mới
                            </button>
                        </form>
                    </div>

                    <div style={tableWrapperStyle}>
                        <div style={{ padding: '16px 20px', borderBottom: '1px solid #e2e8f0', fontWeight: 'bold' }}>
                            🌳 Cấu Trúc Cây Danh Mục Sản Phẩm (Category Tree)
                        </div>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                            <thead>
                                <tr style={tableHeaderRowStyle}>
                                    <th style={thStyle}>Tên Danh Mục</th>
                                    <th style={thStyle}>Cấp Danh Mục</th>
                                    <th style={thStyle}>Số Lượng Sản Phẩm</th>
                                </tr>
                            </thead>
                            <tbody>
                                {categoriesList.map((cat) => (
                                    <tr key={cat.id} style={tableRowStyle}>
                                        <td style={{ ...tdStyle, fontWeight: cat.parentId ? 'normal' : 'bold', paddingLeft: cat.parentId ? '32px' : '16px' }}>
                                            {cat.parentId ? '└─ 📁 ' : '📁 '} {cat.name}
                                        </td>
                                        <td style={tdStyle}><span style={badgeStyle}>{cat.parentId ? 'Danh mục con' : 'Danh mục gốc'}</span></td>
                                        <td style={{ ...tdStyle, fontWeight: 'bold', color: '#2563eb' }}>{cat.productCount || 0} sản phẩm</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* ================= TAB 4: THIẾT LẬP FLASH SALE ================= */}
            {activeTab === 'promotional' && (
                <div style={tableWrapperStyle}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                        <thead>
                            <tr style={tableHeaderRowStyle}>
                                <th style={thStyle}>Sản Phẩm</th>
                                <th style={thStyle}>Giá Gốc</th>
                                <th style={thStyle}>Giá Flash Sale</th>
                                <th style={thStyle}>Thời Gian Kết Thúc</th>
                                <th style={thStyle}>Thao Tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((p) => (
                                <tr key={p._id} style={tableRowStyle}>
                                    <td style={{ ...tdStyle, fontWeight: '600' }}>{p.name}</td>
                                    <td style={tdStyle}>{p.basePrice?.toLocaleString('vi-VN')} đ</td>
                                    <td style={{ ...tdStyle, color: '#dc2626', fontWeight: 'bold' }}>
                                        {p.salePrice ? `${p.salePrice?.toLocaleString('vi-VN')} đ` : <span style={{ color: '#94a3b8', fontWeight: 'normal' }}>Chưa thiết lập</span>}
                                    </td>
                                    <td style={{ ...tdStyle, fontSize: '13px', color: '#059669' }}>
                                        {p.flashSaleEnd ? new Date(p.flashSaleEnd).toLocaleString('vi-VN') : 'Không có'}
                                    </td>
                                    <td style={tdStyle}>
                                        <button
                                            onClick={() => {
                                                setSelectedPromoProduct(p);
                                                setPromoSalePrice(p.salePrice || '');
                                                setPromoEnd(p.flashSaleEnd ? p.flashSaleEnd.substring(0, 16) : '');
                                            }}
                                            style={btnPrimaryStyle}
                                        >
                                            <Percent size={14} /> Cấu Hình Sale
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* MODAL LẬP PHIẾU KHO */}
            {stockModalItem && (
                <div style={modalOverlayStyle}>
                    <div style={modalContentStyle}>
                        <div style={modalHeaderStyle}>
                            <h3 style={{ margin: 0, fontSize: '16px' }}>📦 Lập Phiếu Nhập / Xuất Kho: {stockModalItem.productName}</h3>
                            <button onClick={() => setStockModalItem(null)} style={{ border: 'none', background: 'none', cursor: 'pointer' }}><X size={20} /></button>
                        </div>
                        <div style={{ padding: '20px 0', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                            <div>
                                <label style={labelStyle}>Biến Thể Chọn</label>
                                <input type="text" value={`${stockModalItem.variantName} (Tồn hiện tại: ${stockModalItem.currentStock})`} disabled style={{ ...inputModernStyle, backgroundColor: '#f1f5f9' }} />
                            </div>
                            <div>
                                <label style={labelStyle}>Loại Nghiệp Vụ Kho</label>
                                <select value={stockAdjustType} onChange={(e) => setStockAdjustType(e.target.value)} style={inputModernStyle}>
                                    <option value="IMPORT">📥 Nhập thêm vào kho (Import Stock)</option>
                                    <option value="EXPORT">📤 Xuất bớt khỏi kho (Export Stock)</option>
                                </select>
                            </div>
                            <div>
                                <label style={labelStyle}>Số Lượng Thay Đổi *</label>
                                <input type="number" placeholder="Ví dụ: 50" value={stockAdjustQty} onChange={(e) => setStockAdjustQty(e.target.value)} style={inputModernStyle} />
                            </div>
                            <div>
                                <label style={labelStyle}>Lý Do Điều Chỉnh Kho</label>
                                <input type="text" value={stockAdjustReason} onChange={(e) => setStockAdjustReason(e.target.value)} style={inputModernStyle} />
                            </div>
                        </div>
                        <button onClick={handleStockAdjustment} style={btnSubmitFullStyle}>
                            <Save size={18} /> Xác Nhận Lập Phiếu Kho
                        </button>
                    </div>
                </div>
            )}

            {/* MODAL CẤU HÌNH FLASH SALE */}
            {selectedPromoProduct && (
                <div style={modalOverlayStyle}>
                    <div style={modalContentStyle}>
                        <div style={modalHeaderStyle}>
                            <h3 style={{ margin: 0, fontSize: '16px' }}>🏷️ Thiết Lập Chương Trình Flash Sale</h3>
                            <button onClick={() => setSelectedPromoProduct(null)} style={{ border: 'none', background: 'none', cursor: 'pointer' }}><X size={20} /></button>
                        </div>
                        <div style={{ padding: '20px 0', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                            <div>
                                <label style={labelStyle}>Sản Phẩm</label>
                                <input type="text" value={selectedPromoProduct.name} disabled style={{ ...inputModernStyle, backgroundColor: '#f1f5f9' }} />
                            </div>
                            <div>
                                <label style={labelStyle}>Giá Sale Sau Giảm (VNĐ)</label>
                                <input type="number" placeholder="850000" value={promoSalePrice} onChange={(e) => setPromoSalePrice(e.target.value)} style={inputModernStyle} />
                            </div>
                            <div>
                                <label style={labelStyle}>Thời Gian Kết Thúc Flash Sale</label>
                                <input type="datetime-local" value={promoEnd} onChange={(e) => setPromoEnd(e.target.value)} style={inputModernStyle} />
                            </div>
                        </div>
                        <button onClick={handleSavePromo} style={{ ...btnSubmitFullStyle, backgroundColor: '#059669' }}>
                            <Save size={18} /> Lưu Cấu Hình Flash Sale
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

// STYLESHEET
const containerStyle = { fontFamily: "'Inter', -apple-system, sans-serif", color: '#0f172a' };
const headerContainerStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' };
const titleStyle = { margin: 0, fontSize: '22px', fontWeight: '700', color: '#0f172a' };
const subtitleStyle = { margin: '4px 0 0', fontSize: '13px', color: '#64748b' };

const filterBarContainerStyle = { display: 'flex', justifyContent: 'space-between', gap: '12px', marginBottom: '20px' };
const searchInputStyle = { width: '100%', padding: '10px 12px 10px 40px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box' };
const searchIconStyle = { position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' };
const selectModernStyle = { padding: '10px 14px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '14px', backgroundColor: '#fff' };

const tableWrapperStyle = { backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', overflow: 'hidden', border: '1px solid #e2e8f0' };
const tableHeaderRowStyle = { backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', textAlign: 'left' };
const thStyle = { padding: '14px 16px', fontSize: '12px', fontWeight: '600', color: '#475569', textTransform: 'uppercase' };
const tableRowStyle = { borderBottom: '1px solid #f1f5f9' };
const tdStyle = { padding: '14px 16px', verticalAlign: 'middle' };
const productImgStyle = { width: '48px', height: '48px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #e2e8f0' };

const badgeStyle = { fontSize: '11px', backgroundColor: '#e0f2fe', color: '#0284c7', padding: '2px 6px', borderRadius: '4px' };
const variantPillStyle = { backgroundColor: '#f1f5f9', padding: '2px 8px', borderRadius: '4px', fontSize: '12px', color: '#334155' };
const btnStockActionStyle = { display: 'flex', alignItems: 'center', gap: '4px', backgroundColor: '#e0e7ff', color: '#3730a3', border: 'none', padding: '3px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '11px', fontWeight: 'bold' };

const formCardStyle = { backgroundColor: '#fff', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0' };
const formGrid2Style = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' };
const formGrid3Style = { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginBottom: '20px' };

const labelStyle = { display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px', color: '#334155' };
const inputModernStyle = { width: '100%', padding: '10px 14px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box' };

const dropdownArrowStyle = { position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b', pointerEvents: 'none' };
const dropdownMenuCustomStyle = { position: 'absolute', top: '100%', left: 0, right: 0, backgroundColor: '#fff', border: '1px solid #cbd5e1', borderRadius: '8px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', zIndex: 100, marginTop: '4px', maxHeight: '200px', overflowY: 'auto' };
const dropdownItemStyle = { padding: '10px 14px', fontSize: '13px', color: '#1e293b', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' };

const tagBadgeSelectStyle = { backgroundColor: '#dbeafe', color: '#1e40af', padding: '2px 8px', borderRadius: '4px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' };
const subFormBlockStyle = { backgroundColor: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '20px' };

const btnPrimaryStyle = { display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#2563eb', color: '#fff', border: 'none', padding: '10px 18px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' };
const btnSecondaryStyle = { display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: '#fff', border: '1px solid #cbd5e1', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer' };
const btnSubmitFullStyle = { width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', padding: '12px', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' };
const btnIconEditStyle = { backgroundColor: '#fef08a', color: '#854d0e', border: 'none', padding: '6px 10px', borderRadius: '6px', cursor: 'pointer' };
const btnSmallStyle = { padding: '4px 10px', fontSize: '12px', backgroundColor: '#e2e8f0', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', color: '#334155' };

const paginationContainerStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px', borderTop: '1px solid #e2e8f0', backgroundColor: '#fff' };

const modalOverlayStyle = { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 };
const modalContentStyle = { backgroundColor: '#fff', padding: '24px', borderRadius: '12px', width: '500px', maxWidth: '90%' };
const modalHeaderStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px' };