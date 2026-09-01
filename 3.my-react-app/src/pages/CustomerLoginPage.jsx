import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { ShoppingBag, Mail, Lock, Eye, EyeOff, Loader2, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

export default function CustomerLoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleCustomerLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await axios.post('http://localhost:5000/api/auth/login', {
                email: email.trim().toLowerCase(),
                password
            });

            if (res.data.user?.role !== 'Customer') {
                setError('Tài khoản này thuộc Nhân sự Nội bộ. Vui lòng sử dụng trang Đăng nhập Quản trị!');
                return;
            }

            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));

            navigate('/shop', { replace: true });
        } catch (err) {
            setError(err.response?.data?.message || 'Email hoặc mật khẩu không chính xác!');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                style={styles.card}
            >
                {/* Nút Quay Lại Shop */}
                <Link to="/shop" style={styles.backLink}>
                    <ArrowLeft size={16} /> Quay lại cửa hàng
                </Link>

                <div style={styles.header}>
                    <div style={styles.logoBadge}><ShoppingBag color="#2563eb" size={28} /></div>
                    <h2 style={styles.title}>ĐĂNG NHẬP KHÁCH HÀNG</h2>
                    <p style={styles.subtitle}>Chào mừng bạn quay trở lại với Luxury Store</p>
                </div>

                {error && <div style={styles.errorBox}>{error}</div>}

                <form onSubmit={handleCustomerLogin} style={styles.form}>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Địa chỉ Email</label>
                        <div style={styles.inputWrapper}>
                            <Mail size={18} color="#94a3b8" style={styles.icon} />
                            <input
                                type="email"
                                placeholder="khachhang@gmail.com"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                required
                                style={styles.input}
                            />
                        </div>
                    </div>

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Mật khẩu</label>
                        <div style={styles.inputWrapper}>
                            <Lock size={18} color="#94a3b8" style={styles.icon} />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Nhập mật khẩu"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                required
                                style={{ ...styles.input, paddingRight: '40px' }}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                style={styles.eyeBtn}
                            >
                                {showPassword ? <EyeOff size={18} color="#64748b" /> : <Eye size={18} color="#64748b" />}
                            </button>
                        </div>
                    </div>

                    <button type="submit" disabled={loading} style={styles.submitBtn}>
                        {loading ? <Loader2 size={18} className="animate-spin" /> : 'Đăng Nhập Mua Sắm'}
                    </button>
                </form>

                <div style={styles.footer}>
                    <span>Bạn chưa có tài khoản? </span>
                    <Link to="/register" style={styles.registerLink}>Đăng ký ngay</Link>
                </div>
            </motion.div>
        </div>
    );
}

const styles = {
    container: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', fontFamily: "'Inter', sans-serif", backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.7), rgba(15, 23, 42, 0.7)), url('https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=1920&q=80')`, backgroundSize: 'cover', backgroundPosition: 'center' },
    card: { backgroundColor: '#ffffff', padding: '36px 32px', borderRadius: '20px', width: '100%', maxWidth: '400px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.3)', position: 'relative' },
    backLink: { display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#64748b', textDecoration: 'none', fontSize: '12px', fontWeight: 'bold', marginBottom: '20px' },
    header: { textAlign: 'center', marginBottom: '24px' },
    logoBadge: { width: '50px', height: '50px', backgroundColor: '#eff6ff', borderRadius: '12px', display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '0 auto 10px' },
    title: { fontSize: '20px', fontWeight: '800', color: '#0f172a', margin: 0 },
    subtitle: { fontSize: '13px', color: '#64748b', marginTop: '4px' },
    errorBox: { backgroundColor: '#fef2f2', borderLeft: '4px solid #ef4444', color: '#991b1b', padding: '10px 14px', borderRadius: '8px', fontSize: '13px', marginBottom: '16px' },
    form: { display: 'flex', flexDirection: 'column', gap: '16px' },
    inputGroup: { display: 'flex', flexDirection: 'column', gap: '6px' },
    label: { fontSize: '12px', fontWeight: 'bold', color: '#334155' },
    inputWrapper: { position: 'relative', display: 'flex', alignItems: 'center' },
    icon: { position: 'absolute', left: '12px' },
    input: { width: '100%', padding: '11px 12px 11px 38px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '13px', outline: 'none', boxSizing: 'border-box' },
    eyeBtn: { position: 'absolute', right: '12px', background: 'none', border: 'none', cursor: 'pointer', padding: 0 },
    submitBtn: { padding: '12px', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer', marginTop: '8px' },
    footer: { textAlign: 'center', marginTop: '24px', fontSize: '13px', color: '#64748b' },
    registerLink: { color: '#2563eb', fontWeight: 'bold', textDecoration: 'none' }
};