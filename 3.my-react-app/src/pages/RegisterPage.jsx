import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, User, Mail, Phone, Lock, Shield, Eye, EyeOff, Loader2, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function RegisterPage() {
    // Mặc định chọn vai trò Customer cho người dùng mới
    const [formData, setFormData] = useState({ name: '', email: '', phone: '', password: '', role: 'Customer' });
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [agreeTerms, setAgreeTerms] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Đánh giá độ mạnh mật khẩu (0 -> 4)
    const calculateStrength = (pass) => {
        let score = 0;
        if (pass.length >= 6) score++;
        if (/[A-Z]/.test(pass)) score++;
        if (/[0-9]/.test(pass)) score++;
        if (/[^A-Za-z0-9]/.test(pass)) score++;
        return score;
    };

    const strength = calculateStrength(formData.password);

    const getStrengthLabel = () => {
        if (!formData.password) return { text: '', color: '#cbd5e1' };
        if (strength <= 1) return { text: 'Yếu', color: '#ef4444' };
        if (strength <= 3) return { text: 'Trung bình', color: '#f59e0b' };
        return { text: 'Mạnh (Tối ưu)', color: '#16a34a' };
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password.length < 6) {
            setError('Mật khẩu phải chứa ít nhất 6 ký tự!');
            return;
        }

        if (formData.password !== confirmPassword) {
            setError('Mật khẩu xác nhận không trùng khớp!');
            return;
        }

        if (!agreeTerms) {
            setError('Bạn cần đồng ý với Điều khoản và Quy định bảo mật!');
            return;
        }

        setLoading(true);
        try {
            const res = await axios.post('http://localhost:5000/api/auth/register', formData);
            alert(res.data.message || 'Khởi tạo tài khoản thành công!');

            // 🎯 PHÂN TUYẾN CHUYỂN HƯỚNG THEO DÚNG ROLE ĐÃ CHỌN
            if (formData.role === 'Customer') {
                // Chuyển sang Cổng Đăng Nhập Riêng dành cho Khách Hàng
                navigate('/customer-login', { replace: true });
            } else {
                // Chuyển sang Cổng Đăng Nhập Hệ Thống dành cho Nhân Sự (Staff / Manager / Admin)
                navigate('/login', { replace: true });
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Đăng ký thất bại!');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.bgContainer}>
            <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                style={styles.card}
            >
                <div style={styles.header}>
                    <div style={styles.logoBadge}><UserPlus size={28} color="#16a34a" /></div>
                    <h2 style={styles.title}>ĐĂNG KÝ TÀI KHOẢN</h2>
                    <p style={styles.subtitle}>Cổng đăng ký tài khoản Khách hàng & Nhân sự</p>
                </div>

                {error && <div style={styles.errorBox}>{error}</div>}

                <form onSubmit={handleRegister} style={styles.form}>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Họ và tên</label>
                        <div style={styles.inputWrapper}>
                            <User size={18} color="#94a3b8" style={styles.icon} />
                            <input
                                type="text"
                                name="name"
                                autoComplete="name"
                                placeholder="Nguyễn Văn A"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                required
                                style={styles.input}
                            />
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Email</label>
                            <div style={styles.inputWrapper}>
                                <Mail size={18} color="#94a3b8" style={styles.icon} />
                                <input
                                    type="email"
                                    name="email"
                                    autoComplete="email"
                                    placeholder="name@company.com"
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    required
                                    style={{ ...styles.input, paddingLeft: '34px' }}
                                />
                            </div>
                        </div>

                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Số điện thoại</label>
                            <div style={styles.inputWrapper}>
                                <Phone size={18} color="#94a3b8" style={styles.icon} />
                                <input
                                    type="tel"
                                    name="phone"
                                    autoComplete="tel"
                                    placeholder="0901234567"
                                    value={formData.phone}
                                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                    required
                                    style={{ ...styles.input, paddingLeft: '34px' }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Mật khẩu + Thang đo độ mạnh */}
                    <div style={styles.inputGroup}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <label style={styles.label}>Mật khẩu</label>
                            {formData.password && (
                                <span style={{ fontSize: '11px', fontWeight: 'bold', color: getStrengthLabel().color }}>
                                    Độ mạnh: {getStrengthLabel().text}
                                </span>
                            )}
                        </div>
                        <div style={styles.inputWrapper}>
                            <Lock size={18} color="#94a3b8" style={styles.icon} />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                name="new-password"
                                autoComplete="new-password"
                                placeholder="Tối thiểu 6 ký tự"
                                value={formData.password}
                                onChange={e => setFormData({ ...formData, password: e.target.value })}
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
                        {formData.password && (
                            <div style={styles.strengthBarBg}>
                                <div style={{ ...styles.strengthBarFill, width: `${(strength / 4) * 100}%`, backgroundColor: getStrengthLabel().color }} />
                            </div>
                        )}
                    </div>

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Xác nhận mật khẩu</label>
                        <div style={styles.inputWrapper}>
                            <Lock size={18} color="#94a3b8" style={styles.icon} />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Nhập lại mật khẩu"
                                value={confirmPassword}
                                onChange={e => setConfirmPassword(e.target.value)}
                                required
                                style={styles.input}
                            />
                        </div>
                    </div>

                    {/* Lựa chọn Phân quyền 4 Actor */}
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Loại tài khoản (Vai trò)</label>
                        <div style={styles.inputWrapper}>
                            <Shield size={18} color="#94a3b8" style={styles.icon} />
                            <select
                                value={formData.role}
                                onChange={e => setFormData({ ...formData, role: e.target.value })}
                                style={{ ...styles.input, cursor: 'pointer' }}
                            >
                                <option value="Customer">Khách hàng Mua sắm (Customer)</option>
                                <option value="Staff">Nhân viên Nội bộ (Staff)</option>
                                <option value="Manager">Quản lý Cửa hàng (Manager)</option>
                                <option value="Admin">Quản trị viên Hệ thống (Admin)</option>
                            </select>
                        </div>
                    </div>

                    {/* Điều khoản sử dụng */}
                    <div style={styles.checkboxWrapper}>
                        <input
                            type="checkbox"
                            id="agreeTerms"
                            checked={agreeTerms}
                            onChange={e => setAgreeTerms(e.target.checked)}
                            style={{ cursor: 'pointer', width: '15px', height: '15px' }}
                        />
                        <label htmlFor="agreeTerms" style={styles.checkboxLabel}>
                            Tôi cam kết đồng ý với Điều khoản và Quy định bảo mật
                        </label>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        style={{ ...styles.submitBtn, opacity: loading ? 0.7 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}
                    >
                        {loading ? (
                            <>
                                <Loader2 size={18} className="animate-spin" />
                                <span>Đang khởi tạo...</span>
                            </>
                        ) : (
                            <>
                                <CheckCircle2 size={18} />
                                <span>Tạo Tài Khoản ngay</span>
                            </>
                        )}
                    </button>
                </form>

                <div style={styles.footer}>
                    <span>Đã có tài khoản? </span>
                    <Link to="/login" style={styles.loginLink}>Đăng nhập Nội bộ</Link>
                    <span style={{ margin: '0 6px', color: '#cbd5e1' }}>|</span>
                    <Link to="/customer-login" style={{ ...styles.loginLink, color: '#16a34a' }}>Đăng nhập Khách hàng</Link>
                </div>
            </motion.div>
        </div>
    );
}

const styles = {
    bgContainer: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', fontFamily: "'Segoe UI', sans-serif", backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.65), rgba(15, 23, 42, 0.65)), url('https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1920&q=80')`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' },
    card: { backgroundColor: '#ffffff', padding: '32px 30px', borderRadius: '16px', width: '100%', maxWidth: '440px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)' },
    header: { textAlign: 'center', marginBottom: '16px' },
    logoBadge: { width: '46px', height: '46px', backgroundColor: '#f0fdf4', borderRadius: '12px', display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '0 auto 8px' },
    title: { fontSize: '18px', fontWeight: '800', color: '#0f172a', margin: 0 },
    subtitle: { fontSize: '13px', color: '#64748b', marginTop: '3px' },
    errorBox: { backgroundColor: '#fef2f2', borderLeft: '4px solid #ef4444', color: '#991b1b', padding: '10px 14px', borderRadius: '6px', fontSize: '13px', marginBottom: '14px' },
    form: { display: 'flex', flexDirection: 'column', gap: '12px' },
    inputGroup: { display: 'flex', flexDirection: 'column', gap: '4px' },
    label: { fontSize: '12px', fontWeight: '600', color: '#334155' },
    inputWrapper: { position: 'relative', display: 'flex', alignItems: 'center' },
    icon: { position: 'absolute', left: '10px' },
    input: { width: '100%', padding: '9px 12px 9px 34px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', outline: 'none', boxSizing: 'border-box' },
    eyeBtn: { position: 'absolute', right: '10px', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '4px' },
    strengthBarBg: { width: '100%', height: '4px', backgroundColor: '#e2e8f0', borderRadius: '2px', overflow: 'hidden', marginTop: '4px' },
    strengthBarFill: { height: '100%', transition: 'all 0.3s ease' },
    checkboxWrapper: { display: 'flex', alignItems: 'flex-start', gap: '8px', marginTop: '2px' },
    checkboxLabel: { fontSize: '12px', color: '#475569', cursor: 'pointer', userSelect: 'none', lineHeight: '1.4' },
    submitBtn: { display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', width: '100%', padding: '11px', backgroundColor: '#16a34a', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer', marginTop: '4px' },
    footer: { textAlign: 'center', marginTop: '16px', fontSize: '12px', color: '#64748b' },
    loginLink: { color: '#2563eb', fontWeight: '600', textDecoration: 'none' }
};