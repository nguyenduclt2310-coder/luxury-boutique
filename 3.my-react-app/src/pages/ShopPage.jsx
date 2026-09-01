import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import {
    ShoppingBag, Search, User, LogOut, Package, CheckCircle, ShieldCheck,
    Phone, Mail, MapPin, ArrowRight, Star, Heart, Truck, RefreshCw, Headphones,
    Filter, Sparkles, Eye, X
} from 'lucide-react';

export default function ShopPage() {
    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [quickViewProduct, setQuickViewProduct] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [customer, setCustomer] = useState({ name: '', phone: '', address: '' });
    const [loading, setLoading] = useState(false);
    const [orderSuccess, setOrderSuccess] = useState(false);
    const [wishlist, setWishlist] = useState([]);

    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const token = localStorage.getItem('token');

    useEffect(() => {
        axios.get('http://localhost:5000/api/products')
            .then(res => setProducts(res.data))
            .catch(err => console.error('Lỗi tải sản phẩm:', err));

        if (user.name) {
            setCustomer(prev => ({ ...prev, name: user.name, phone: user.phone || '' }));
        }
    }, []);

    const handleLogout = () => {
        localStorage.clear();
        navigate('/customer-login');
    };

    const toggleWishlist = (id) => {
        setWishlist(prev => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]);
    };

    const handleOrderSubmit = async (e) => {
        e.preventDefault();
        if (!selectedProduct) return;

        setLoading(true);
        try {
            const orderData = {
                customerName: customer.name,
                customerPhone: customer.phone,
                address: customer.address,
                items: [{
                    productId: selectedProduct._id,
                    productName: selectedProduct.name,
                    price: selectedProduct.price,
                    quantity: Number(quantity)
                }],
                totalAmount: selectedProduct.price * Number(quantity)
            };

            await axios.post('http://localhost:5000/api/orders', orderData);
            setOrderSuccess(true);
            setTimeout(() => {
                setOrderSuccess(false);
                setSelectedProduct(null);
            }, 2500);
        } catch (err) {
            alert(err.response?.data?.message || 'Có lỗi xảy ra khi đặt hàng!');
        } finally {
            setLoading(false);
        }
    };

    const filteredProducts = products.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
        return matchesSearch;
    });

    return (
        <div style={styles.wrapper}>
            {/* TOP ANNOUNCEMENT BAR */}
            <div style={styles.topBar}>
                <div style={styles.topBarContainer}>
                    <span><Sparkles size={14} color="#f59e0b" style={{ inline: 'true' }} /> VIP MEMBER: Miễn phí giao hàng toàn quốc cho đơn hàng từ 1.000.000đ</span>
                    <div style={{ display: 'flex', gap: '20px' }}>
                        <span><Phone size={13} /> Hotline: 1900 8888</span>
                        <span><Mail size={13} /> support@luxurybrand.com</span>
                    </div>
                </div>
            </div>

            {/* HEADER CỐ ĐỊNH SANG TRỌNG */}
            <header style={styles.header}>
                <div style={styles.headerContainer}>
                    <div style={styles.logoGroup} onClick={() => navigate('/shop')}>
                        <div style={styles.logoIcon}><ShoppingBag color="#fff" size={22} /></div>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={styles.logoText}>LUXURY<span style={{ color: '#2563eb' }}>BOUTIQUE</span></span>
                            <span style={{ fontSize: '9px', letterSpacing: '2px', color: '#64748b', fontWeight: 'bold' }}>PREMIUM SELECTION</span>
                        </div>
                    </div>

                    <div style={styles.searchBox}>
                        <Search size={18} color="#94a3b8" />
                        <input
                            type="text"
                            placeholder="Tìm kiếm sản phẩm đẳng cấp, thiết bị cao cấp..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            style={styles.searchInput}
                        />
                    </div>

                    <div style={styles.headerActions}>
                        {token && user.role === 'Customer' ? (
                            <div style={styles.userInfo}>
                                <div style={styles.avatar}>{user.name?.charAt(0).toUpperCase()}</div>
                                <div>
                                    <div style={styles.userName}>{user.name}</div>
                                    <div style={{ fontSize: '10px', color: '#16a34a', fontWeight: 'bold' }}>Thành viên VIP</div>
                                </div>
                                <button onClick={handleLogout} title="Đăng xuất" style={styles.logoutBtn}>
                                    <LogOut size={16} color="#ef4444" />
                                </button>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                <Link to="/customer-login" style={styles.btnSecondary}>Đăng Nhập</Link>
                                <Link to="/register" style={styles.btnPrimaryNav}>Khởi Tạo Tài Khoản</Link>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            {/* HERO BANNER ĐẲNG CẤP HOÀNG GIA */}
            <section style={styles.hero}>
                <div style={styles.heroOverlay}></div>
                <div style={styles.heroContent}>
                    <span style={styles.heroBadge}><Sparkles size={14} /> BST ĐỘC QUYỀN 2026</span>
                    <h1 style={styles.heroTitle}>Định Hình Phong Cách Sống Thượng Lưu</h1>
                    <p style={styles.heroSub}>Khám phá những tuyệt tác công nghệ và thời trang cao cấp được tuyển chọn khắt khe nhất dành riêng cho bạn.</p>

                    <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
                        <a href="#products-section" style={styles.heroBtnPrimary}>Mua Sắm Ngay <ArrowRight size={18} /></a>
                    </div>

                    {/* SOCIAL PROOF */}
                    <div style={styles.heroStats}>
                        <div>
                            <div style={styles.statNum}>10K+</div>
                            <div style={styles.statText}>Khách hàng VIP</div>
                        </div>
                        <div style={styles.statDivider}></div>
                        <div>
                            <div style={styles.statNum}>100%</div>
                            <div style={styles.statText}>Chính hãng nhập khẩu</div>
                        </div>
                        <div style={styles.statDivider}></div>
                        <div>
                            <div style={styles.statNum}>4.9/5 ★</div>
                            <div style={styles.statText}>Đánh giá hài lòng</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FEATURE STRIP - CAM KẾT DỊCH VỤ */}
            <section style={styles.featureStrip}>
                <div style={styles.featureGrid}>
                    <div style={styles.featureItem}>
                        <Truck size={28} color="#2563eb" />
                        <div>
                            <h4 style={styles.featureTitle}>Vận Chuyển Hỏa Tốc</h4>
                            <p style={styles.featureSub}>Giao hàng bảo đảm trong 2h</p>
                        </div>
                    </div>
                    <div style={styles.featureItem}>
                        <ShieldCheck size={28} color="#2563eb" />
                        <div>
                            <h4 style={styles.featureTitle}>Bảo Hành Chính Hãng</h4>
                            <p style={styles.featureSub}>Cam kết 1 đổi 1 trong 30 ngày</p>
                        </div>
                    </div>
                    <div style={styles.featureItem}>
                        <RefreshCw size={28} color="#2563eb" />
                        <div>
                            <h4 style={styles.featureTitle}>Đổi Trả Dễ Dàng</h4>
                            <p style={styles.featureSub}>Hỗ trợ tận nhà hoàn toàn miễn phí</p>
                        </div>
                    </div>
                    <div style={styles.featureItem}>
                        <Headphones size={28} color="#2563eb" />
                        <div>
                            <h4 style={styles.featureTitle}>Tư Vấn VIP 24/7</h4>
                            <p style={styles.featureSub}>Chăm sóc khách hàng ưu tiên</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* DANH SÁCH SẢN PHẨM PHÂN TRANG / FILTER */}
            <main id="products-section" style={styles.mainContent}>
                <div style={styles.sectionHeader}>
                    <span style={styles.sectionTag}>BESTSELLER PRODUCTS</span>
                    <h2 style={styles.sectionTitle}>Danh Mục Sản Phẩm Nổi Bật</h2>
                    <div style={styles.titleLine}></div>
                </div>

                <div style={styles.productGrid}>
                    {filteredProducts.length === 0 ? (
                        <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '80px 0', color: '#64748b' }}>
                            <Package size={56} color="#cbd5e1" />
                            <p style={{ marginTop: '16px', fontSize: '16px', fontWeight: 'bold' }}>Chưa có sản phẩm nào phù hợp!</p>
                        </div>
                    ) : (
                        filteredProducts.map(product => (
                            <div key={product._id} style={styles.productCard}>
                                <div style={styles.imagePlaceholder}>
                                    <Package size={52} color="#cbd5e1" />
                                    <span style={styles.stockBadge}>Còn {product.stock || 50} sp</span>

                                    {/* Nút yêu thích */}
                                    <button
                                        onClick={() => toggleWishlist(product._id)}
                                        style={{
                                            ...styles.wishlistBtn,
                                            color: wishlist.includes(product._id) ? '#ef4444' : '#64748b'
                                        }}
                                    >
                                        <Heart size={16} fill={wishlist.includes(product._id) ? '#ef4444' : 'none'} />
                                    </button>

                                    {/* Quick View Button */}
                                    <button onClick={() => setQuickViewProduct(product)} style={styles.quickViewBtn}>
                                        <Eye size={14} /> Xem Nhanh
                                    </button>
                                </div>

                                <div style={styles.cardBody}>
                                    <div style={styles.ratingRow}>
                                        <div style={{ display: 'flex', gap: '2px', color: '#f59e0b' }}>
                                            <Star size={13} fill="#f59e0b" />
                                            <Star size={13} fill="#f59e0b" />
                                            <Star size={13} fill="#f59e0b" />
                                            <Star size={13} fill="#f59e0b" />
                                            <Star size={13} fill="#f59e0b" />
                                        </div>
                                        <span style={{ fontSize: '11px', color: '#94a3b8' }}>(4.9)</span>
                                    </div>

                                    <h3 style={styles.productName}>{product.name}</h3>

                                    <div style={styles.priceRow}>
                                        <div>
                                            <div style={styles.price}>{(product.price || 0).toLocaleString('vi-VN')} VNĐ</div>
                                            <div style={styles.oldPrice}>{((product.price || 0) * 1.15).toLocaleString('vi-VN')} VNĐ</div>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => setSelectedProduct(product)}
                                        style={styles.buyBtn}
                                    >
                                        <ShoppingBag size={16} /> Đặt Mua Ngay
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </main>

            {/* QUICK VIEW MODAL */}
            {quickViewProduct && (
                <div style={styles.modalOverlay}>
                    <div style={styles.quickViewCard}>
                        <button onClick={() => setQuickViewProduct(null)} style={styles.closeBtn}><X size={20} /></button>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                            <div style={styles.quickViewImage}>
                                <Package size={80} color="#cbd5e1" />
                            </div>
                            <div>
                                <span style={styles.heroBadge}>PREMIUM ITEM</span>
                                <h2 style={{ fontSize: '22px', margin: '10px 0', color: '#0f172a' }}>{quickViewProduct.name}</h2>
                                <div style={{ fontSize: '24px', fontWeight: '800', color: '#2563eb', marginBottom: '16px' }}>
                                    {(quickViewProduct.price || 0).toLocaleString('vi-VN')} VNĐ
                                </div>
                                <p style={{ fontSize: '13px', color: '#64748b', lineHeight: '1.6', marginBottom: '20px' }}>
                                    Sản phẩm chính hãng chất lượng cao, đi kèm chế độ bảo hành 24 tháng chính hãng và hỗ trợ kỹ thuật trọn đời.
                                </p>
                                <button
                                    onClick={() => {
                                        setSelectedProduct(quickViewProduct);
                                        setQuickViewProduct(null);
                                    }}
                                    style={styles.buyBtn}
                                >
                                    Tiến Hành Đặt Hàng
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL ĐẶT HÀNG / THANH TOÁN */}
            {selectedProduct && (
                <div style={styles.modalOverlay}>
                    <div style={styles.modalCard}>
                        <div style={styles.modalHeader}>
                            <div>
                                <h3 style={{ margin: 0, fontSize: '18px' }}>XÁC NHẬN ĐƠN HÀNG VIP</h3>
                                <span style={{ fontSize: '12px', color: '#64748b' }}>Hệ thống liên kết trực tiếp kho ERP</span>
                            </div>
                            <button onClick={() => setSelectedProduct(null)} style={styles.closeBtn}><X size={20} /></button>
                        </div>

                        {orderSuccess ? (
                            <div style={{ textAlign: 'center', padding: '36px 0' }}>
                                <CheckCircle size={70} color="#16a34a" style={{ margin: '0 auto 16px' }} />
                                <h3 style={{ color: '#16a34a', fontSize: '22px' }}>Đặt Hàng Thành Công!</h3>
                                <p style={{ color: '#64748b', fontSize: '14px', marginTop: '8px' }}>
                                    Đơn hàng đã tự động chuyển sang trang Quản Trị Nhân Sự để tiến hành đóng gói.
                                </p>
                            </div>
                        ) : (
                            <form onSubmit={handleOrderSubmit} style={styles.modalForm}>
                                <div style={styles.billBox}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                        <span style={{ fontWeight: 'bold', color: '#0f172a' }}>{selectedProduct.name}</span>
                                        <span style={{ color: '#2563eb', fontWeight: 'bold' }}>
                                            {(selectedProduct.price * quantity).toLocaleString('vi-VN')} VNĐ
                                        </span>
                                    </div>
                                    <div style={{ fontSize: '12px', color: '#64748b' }}>
                                        Số lượng chọn mua: {quantity} sản phẩm
                                    </div>
                                </div>

                                <div>
                                    <label style={styles.label}>Họ và tên người nhận hàng *</label>
                                    <input
                                        type="text"
                                        required
                                        value={customer.name}
                                        onChange={e => setCustomer({ ...customer, name: e.target.value })}
                                        style={styles.input}
                                        placeholder="Nguyễn Văn A"
                                    />
                                </div>

                                <div>
                                    <label style={styles.label}>Số điện thoại giao hàng *</label>
                                    <input
                                        type="tel"
                                        required
                                        value={customer.phone}
                                        onChange={e => setCustomer({ ...customer, phone: e.target.value })}
                                        style={styles.input}
                                        placeholder="0901234567"
                                    />
                                </div>

                                <div>
                                    <label style={styles.label}>Địa chỉ nhận hàng chi tiết *</label>
                                    <input
                                        type="text"
                                        required
                                        value={customer.address}
                                        onChange={e => setCustomer({ ...customer, address: e.target.value })}
                                        style={styles.input}
                                        placeholder="Số nhà, Tên đường, Quận/Huyện, Tỉnh/Thành phố"
                                    />
                                </div>

                                <div>
                                    <label style={styles.label}>Số lượng đặt mua</label>
                                    <input
                                        type="number"
                                        min="1"
                                        value={quantity}
                                        onChange={e => setQuantity(e.target.value)}
                                        style={styles.input}
                                    />
                                </div>

                                <button type="submit" disabled={loading} style={styles.submitOrderBtn}>
                                    {loading ? 'Đang Khởi Tạo Đơn Hàng...' : 'XÁC NHẬN ĐẶT HÀNG NGAY'}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            )}

            {/* FOOTER HOÀNG GIA */}
            <footer style={styles.footer}>
                <div style={styles.footerContainer}>
                    <div style={styles.footerCol}>
                        <div style={styles.logoGroup}>
                            <div style={styles.logoIcon}><ShoppingBag color="#fff" size={20} /></div>
                            <span style={{ ...styles.logoText, color: '#fff' }}>LUXURY<span style={{ color: '#2563eb' }}>BOUTIQUE</span></span>
                        </div>
                        <p style={{ color: '#94a3b8', fontSize: '13px', lineHeight: '1.7', marginTop: '12px' }}>
                            Thương hiệu bán lẻ cao cấp tích hợp tự động hóa dữ liệu đơn hàng về hệ thống Quản Trị Enterprise ERP.
                        </p>
                    </div>
                    <div style={styles.footerCol}>
                        <h4 style={styles.footerTitle}>Tổng Đài Hỗ Trợ</h4>

                        {/* Click để gọi điện */}
                        <a href="tel:19008888" style={styles.footerLink}>
                            <Phone size={14} color="#2563eb" /> Hotline: 1900 8888 (24/7)
                        </a>

                        {/* Click để mở ứng dụng gửi Mail */}
                        <a href="mailto:vip@luxurybrand.com" style={styles.footerLink}>
                            <Mail size={14} color="#2563eb" /> Email: vip@luxurybrand.com
                        </a>

                        {/* Click để nhảy trực tiếp sang Google Maps Hoàn Kiếm, Hà Nội */}
                        <a
                            href="https://maps.google.com/?q=Hoan+Kiem,+Ha+Noi"
                            target="_blank"
                            rel="noopener noreferrer"
                            style={styles.footerLinkHover}
                        >
                            <MapPin size={14} color="#2563eb" /> Trụ sở: Hoàn Kiếm, Hà Nội
                        </a>
                    </div>

                    <div style={styles.footerCol}>
                        <h4 style={styles.footerTitle}>Chính Sách Khách Hàng</h4>
                        <div style={styles.footerLink}><ShieldCheck size={14} color="#2563eb" /> Bảo hành chính hãng</div>
                        <div style={styles.footerLink}><Truck size={14} color="#2563eb" /> Miễn phí vận chuyển toàn quốc</div>
                        <div style={styles.footerLink}><RefreshCw size={14} color="#2563eb" /> Đổi trả trong vòng 30 ngày</div>
                    </div>
                </div>

                <div style={styles.footerBottom}>
                    © 2026 LUXURY STOREFRONT SYSTEM. POWERED BY ENTERPRISE ERP.
                </div>
            </footer>
        </div>
    );
}

const styles = {
    wrapper: { backgroundColor: '#f8fafc', minHeight: '100vh', fontFamily: "'Inter', sans-serif" },
    topBar: { backgroundColor: '#0f172a', color: '#cbd5e1', fontSize: '12px', padding: '8px 0', borderBottom: '1px solid #1e293b' },
    topBarContainer: { maxWidth: '1200px', margin: '0 auto', padding: '0 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    header: { position: 'sticky', top: 0, zIndex: 100, backgroundColor: '#ffffff', borderBottom: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' },
    headerContainer: { maxWidth: '1200px', margin: '0 auto', padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '24px' },
    logoGroup: { display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' },
    logoIcon: { backgroundColor: '#2563eb', padding: '8px', borderRadius: '12px', display: 'flex', boxShadow: '0 4px 10px rgba(37,99,235,0.3)' },
    logoText: { fontSize: '20px', fontWeight: '900', color: '#0f172a', letterSpacing: '-0.5px' },
    searchBox: { flex: 1, maxWidth: '480px', display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: '#f1f5f9', padding: '10px 18px', borderRadius: '99px', border: '1px solid #e2e8f0' },
    searchInput: { border: 'none', background: 'transparent', outline: 'none', width: '100%', fontSize: '13px' },
    headerActions: { display: 'flex', alignItems: 'center', gap: '16px' },
    userInfo: { display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: '#eff6ff', padding: '6px 14px', borderRadius: '30px', border: '1px solid #bfdbfe' },
    avatar: { width: '32px', height: '32px', backgroundColor: '#2563eb', color: '#fff', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold', fontSize: '14px' },
    userName: { fontSize: '13px', fontWeight: 'bold', color: '#1e293b' },
    logoutBtn: { border: 'none', background: 'none', cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center' },
    btnSecondary: { padding: '9px 18px', borderRadius: '20px', color: '#334155', textDecoration: 'none', fontSize: '13px', fontWeight: 'bold' },
    btnPrimaryNav: { padding: '9px 20px', borderRadius: '20px', backgroundColor: '#2563eb', color: '#fff', textDecoration: 'none', fontSize: '13px', fontWeight: 'bold', boxShadow: '0 4px 10px rgba(37,99,235,0.25)' },

    hero: { position: 'relative', backgroundImage: `url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1920&q=80')`, backgroundSize: 'cover', backgroundPosition: 'center', padding: '110px 24px', color: '#fff', textAlign: 'center' },
    heroOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.82)' },
    heroContent: { position: 'relative', zIndex: 1, maxWidth: '800px', margin: '0 auto' },
    heroBadge: { backgroundColor: 'rgba(37, 99, 235, 0.25)', color: '#60a5fa', border: '1px solid #2563eb', padding: '6px 16px', borderRadius: '30px', fontSize: '12px', fontWeight: 'bold', display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '16px' },
    heroTitle: { fontSize: '48px', fontWeight: '900', margin: '0 0 16px', letterSpacing: '-1px' },
    heroSub: { fontSize: '16px', color: '#cbd5e1', marginBottom: '32px', lineHeight: '1.6' },
    heroBtnPrimary: { display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: '#2563eb', color: '#fff', padding: '14px 32px', borderRadius: '99px', textDecoration: 'none', fontWeight: 'bold', fontSize: '15px', boxShadow: '0 6px 20px rgba(37,99,235,0.4)' },
    heroStats: { display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '30px', marginTop: '60px', backgroundColor: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(10px)', padding: '20px 40px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)' },
    statNum: { fontSize: '20px', fontWeight: 'bold', color: '#60a5fa' },
    statText: { fontSize: '12px', color: '#94a3b8', marginTop: '2px' },
    statDivider: { width: '1px', height: '30px', backgroundColor: 'rgba(255,255,255,0.15)' },

    featureStrip: { backgroundColor: '#fff', borderBottom: '1px solid #e2e8f0', padding: '30px 24px' },
    featureGrid: { maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' },
    featureItem: { display: 'flex', alignItems: 'center', gap: '16px' },
    featureTitle: { fontSize: '14px', fontWeight: 'bold', color: '#0f172a', margin: 0 },
    featureSub: { fontSize: '12px', color: '#64748b', margin: '2px 0 0' },

    mainContent: { maxWidth: '1200px', margin: '0 auto', padding: '70px 24px' },
    sectionHeader: { textAlign: 'center', marginBottom: '50px' },
    sectionTag: { fontSize: '12px', fontWeight: '800', color: '#2563eb', letterSpacing: '1px' },
    sectionTitle: { fontSize: '28px', fontWeight: '800', color: '#0f172a', margin: '8px 0' },
    titleLine: { width: '60px', height: '3px', backgroundColor: '#2563eb', margin: '0 auto', borderRadius: '2px' },

    productGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))', gap: '28px' },
    productCard: { backgroundColor: '#fff', borderRadius: '20px', overflow: 'hidden', border: '1px solid #e2e8f0', boxShadow: '0 4px 15px rgba(0,0,0,0.03)', transition: 'all 0.3s' },
    imagePlaceholder: { height: '200px', backgroundColor: '#f8fafc', display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative' },
    stockBadge: { position: 'absolute', top: '12px', left: '12px', backgroundColor: '#dcfce7', color: '#16a34a', padding: '4px 10px', borderRadius: '8px', fontSize: '11px', fontWeight: 'bold' },
    wishlistBtn: { position: 'absolute', top: '12px', right: '12px', backgroundColor: '#fff', border: 'none', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer', boxShadow: '0 2px 6px rgba(0,0,0,0.1)' },
    quickViewBtn: { position: 'absolute', bottom: '12px', backgroundColor: 'rgba(15,23,42,0.8)', color: '#fff', border: 'none', borderRadius: '20px', padding: '6px 14px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' },

    cardBody: { padding: '22px' },
    ratingRow: { display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' },
    productName: { fontSize: '16px', fontWeight: 'bold', color: '#0f172a', margin: '0 0 10px', height: '42px', overflow: 'hidden' },
    priceRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '18px' },
    price: { fontSize: '20px', fontWeight: '900', color: '#2563eb' },
    oldPrice: { fontSize: '12px', color: '#94a3b8', textDecoration: 'line-through', marginTop: '2px' },
    buyBtn: { width: '100%', padding: '12px', backgroundColor: '#0f172a', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', fontSize: '14px' },

    modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(4px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
    quickViewCard: { backgroundColor: '#fff', width: '100%', maxWidth: '650px', borderRadius: '24px', padding: '32px', position: 'relative' },
    quickViewImage: { height: '240px', backgroundColor: '#f8fafc', borderRadius: '16px', display: 'flex', justifyContent: 'center', alignItems: 'center' },
    modalCard: { backgroundColor: '#fff', width: '100%', maxWidth: '440px', borderRadius: '24px', padding: '28px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' },
    modalHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' },
    closeBtn: { border: 'none', background: '#f1f5f9', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer', color: '#64748b' },
    billBox: { backgroundColor: '#eff6ff', padding: '16px', borderRadius: '12px', border: '1px solid #bfdbfe', marginBottom: '16px' },
    modalForm: { display: 'flex', flexDirection: 'column', gap: '14px' },
    label: { fontSize: '12px', fontWeight: 'bold', color: '#334155', marginBottom: '4px', display: 'block' },
    input: { width: '100%', padding: '11px', borderRadius: '10px', border: '1px solid #cbd5e1', outline: 'none', boxSizing: 'border-box', fontSize: '13px' },
    submitOrderBtn: { padding: '14px', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer', marginTop: '8px', boxShadow: '0 4px 12px rgba(37,99,235,0.3)' },
    footer: { backgroundColor: '#0f172a', color: '#fff', paddingTop: '70px' },
    footerContainer: { maxWidth: '1200px', margin: '0 auto', padding: '0 24px 50px', display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '50px' },
    footerCol: { display: 'flex', flexDirection: 'column', gap: '14px' },
    footerTitle: { fontSize: '16px', fontWeight: 'bold', color: '#fff', margin: '0 0 8px' },
    footerBottom: { borderTop: '1px solid #1e293b', padding: '24px', textAlign: 'center', color: '#64748b', fontSize: '12px', letterSpacing: '1px' },
    footerLink: {
        color: '#94a3b8',
        fontSize: '13px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        textDecoration: 'none',
        cursor: 'pointer',
        transition: 'color 0.2s ease'
    }
};
