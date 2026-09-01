import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { Shield, Mail, Lock, Eye, EyeOff, RotateCw, ArrowRight, CheckSquare } from 'lucide-react';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [captchaInput, setCaptchaInput] = useState('');
    const [captchaCode, setCaptchaCode] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(true);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    // Tạo CAPTCHA ngẫu nhiên 6 ký tự
    const generateCaptcha = () => {
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Bỏ I, O, 0, 1 tránh nhầm lẫn
        let result = '';
        for (let i = 0; i < 6; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        setCaptchaCode(result);
    };

    useEffect(() => {
        generateCaptcha();
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        if (captchaInput.toUpperCase() !== captchaCode) {
            setError('Mã xác nhận (CAPTCHA) không chính xác!');
            generateCaptcha();
            setCaptchaInput('');
            return;
        }

        setLoading(true);
        try {
            const res = await axios.post('http://localhost:5000/api/auth/login', {
                email: email.trim().toLowerCase(),
                password
            });

            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));

            if (res.data.user?.role === 'Customer') {
                navigate('/shop');
            } else {
                navigate('/dashboard');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Đăng nhập thất bại. Kiểm tra lại tài khoản!');
            generateCaptcha();
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.bgContainer}>
            <div style={styles.card}>
                <div style={styles.header}>
                    <div style={styles.badge}><Shield size={22} color="#2563eb" /></div>
                    <h2 style={styles.title}>HỆ THỐNG QUẢN TRỊ DOANH NGHIỆP</h2>
                    <p style={styles.subtitle}>Cổng đăng nhập xác thực tài khoản nội bộ</p>
                </div>

                {error && <div style={styles.errorBox}>{error}</div>}

                <form onSubmit={handleLogin} style={styles.form}>
                    {/* EMAIL */}
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Email doanh nghiệp</label>
                        <div style={styles.inputWrapper}>
                            <Mail size={16} color="#94a3b8" style={styles.icon} />
                            <input
                                type="email"
                                placeholder="nguyenductt230@gmail.com"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                required
                                style={styles.input}
                            />
                        </div>
                    </div>

                    {/* MẬT KHẨU */}
                    <div style={styles.inputGroup}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <label style={styles.label}>Mật khẩu</label>
                            <Link to="/forgot-password" style={styles.forgotLink}>Quên mật khẩu?</Link>
                        </div>
                        <div style={styles.inputWrapper}>
                            <Lock size={16} color="#94a3b8" style={styles.icon} />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                placeholder="••••••••"
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
                                {showPassword ? <EyeOff size={16} color="#64748b" /> : <Eye size={16} color="#64748b" />}
                            </button>
                        </div>
                    </div>

                    {/* CAPTCHA ĐƯỢC CHE CHẮN CHỐNG BOT */}
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Xác thực an toàn (CAPTCHA)</label>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', alignItems: 'center' }}>

                            {/* BOX CHỨA CAPTCHA BẢO MẬT */}
                            <div style={styles.captchaBox}>
                                <span style={styles.captchaText}>{captchaCode}</span>
                                {/* Vạch kẻ bảo mật chống OCR Bot */}
                                <div style={styles.captchaStrike1}></div>
                                <div style={styles.captchaStrike2}></div>
                                <button
                                    type="button"
                                    onClick={generateCaptcha}
                                    style={styles.refreshCaptchaBtn}
                                    title="Đổi mã khác"
                                >
                                    <RotateCw size={14} color="#475569" />
                                </button>
                            </div>

                            {/* INPUT NHẬP CAPTCHA (TỰ CHUYỂN HOA) */}
                            <input
                                type="text"
                                placeholder="NHẬP MÃ"
                                maxLength={6}
                                value={captchaInput}
                                onChange={e => setCaptchaInput(e.target.value.toUpperCase())}
                                required
                                style={styles.captchaInput}
                            />
                        </div>
                    </div>

                    {/* CHECKBOX GHI NHỚ */}
                    <div style={styles.rememberRow}>
                        <input
                            type="checkbox"
                            id="remember"
                            checked={rememberMe}
                            onChange={e => setRememberMe(e.target.checked)}
                            style={{ cursor: 'pointer' }}
                        />
                        <label htmlFor="remember" style={styles.rememberLabel}>Ghi nhớ tài khoản này</label>
                    </div>

                    <button type="submit" disabled={loading} style={styles.submitBtn}>
                        {loading ? 'Đang xác thực...' : <><span>Đăng Nhập</span> <ArrowRight size={16} /></>}
                    </button>
                </form>

                <div style={styles.footer}>
                    <span>Chưa có tài khoản? </span>
                    <Link to="/register" style={styles.registerLink}>Đăng ký nhân sự mới</Link>
                </div>
            </div>
        </div>
    );
}

const styles = {
    bgContainer: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', fontFamily: "'Segoe UI', sans-serif", backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.65), rgba(15, 23, 42, 0.65)), url('https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1920&q=80')`, backgroundSize: 'cover', backgroundPosition: 'center' },
    card: { backgroundColor: '#ffffff', padding: '36px 32px', borderRadius: '16px', width: '100%', maxWidth: '420px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)' },
    header: { textAlign: 'center', marginBottom: '22px' },
    badge: { width: '42px', height: '42px', backgroundColor: '#eff6ff', borderRadius: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '0 auto 10px' },
    title: { fontSize: '17px', fontWeight: '800', color: '#0f172a', margin: 0 },
    subtitle: { fontSize: '12px', color: '#64748b', marginTop: '4px' },
    errorBox: { backgroundColor: '#fef2f2', color: '#991b1b', borderLeft: '4px solid #ef4444', padding: '10px', borderRadius: '6px', fontSize: '12px', marginBottom: '14px' },
    form: { display: 'flex', flexDirection: 'column', gap: '14px' },
    inputGroup: { display: 'flex', flexDirection: 'column', gap: '4px' },
    label: { fontSize: '12px', fontWeight: '600', color: '#334155' },
    inputWrapper: { position: 'relative', display: 'flex', alignItems: 'center' },
    icon: { position: 'absolute', left: '12px' },
    input: { width: '100%', padding: '10px 12px 10px 36px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', outline: 'none', boxSizing: 'border-box' },
    forgotLink: { fontSize: '12px', color: '#2563eb', textDecoration: 'none' },
    eyeBtn: { position: 'absolute', right: '12px', background: 'none', border: 'none', cursor: 'pointer', display: 'flex' },

    // CAPTCHA BẢO MẬT DẠNG CHE NỀN
    captchaBox: {
        position: 'relative',
        backgroundColor: '#e2e8f0',
        backgroundImage: 'radial-gradient(#94a3b8 1px, transparent 0)',
        backgroundSize: '6px 6px',
        borderRadius: '8px',
        height: '42px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        userSelect: 'none',
        overflow: 'hidden',
        border: '1px solid #cbd5e1'
    },
    captchaText: {
        fontFamily: "'Courier New', monospace",
        fontSize: '20px',
        fontWeight: '900',
        letterSpacing: '5px',
        color: '#0f172a',
        fontStyle: 'italic',
        transform: 'skewX(-10deg)'
    },
    captchaStrike1: { position: 'absolute', width: '100%', height: '2px', backgroundColor: 'rgba(15, 23, 42, 0.4)', top: '35%', rotate: '-5deg' },
    captchaStrike2: { position: 'absolute', width: '100%', height: '2px', backgroundColor: 'rgba(15, 23, 42, 0.3)', top: '65%', rotate: '6deg' },
    refreshCaptchaBtn: { position: 'absolute', right: '6px', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '4px', cursor: 'pointer', display: 'flex' },

    captchaInput: { width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', fontWeight: 'bold', letterSpacing: '2px', textTransform: 'uppercase', textAlign: 'center', outline: 'none', boxSizing: 'border-box' },
    rememberRow: { display: 'flex', alignItems: 'center', gap: '8px' },
    rememberLabel: { fontSize: '12px', color: '#475569', cursor: 'pointer' },
    submitBtn: { display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', padding: '12px', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer', marginTop: '4px' },
    footer: { textAlign: 'center', marginTop: '20px', fontSize: '12px', color: '#64748b' },
    registerLink: { color: '#2563eb', fontWeight: 'bold', textDecoration: 'none' }
};