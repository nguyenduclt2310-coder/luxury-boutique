import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { KeyRound, Mail, Phone, CheckCircle2, ArrowLeft, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ForgotPasswordPage() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  
  // State quản lý đếm ngược thời gian (30 giây)
  const [countdown, setCountdown] = useState(0);
  const navigate = useNavigate();

  // Effect chạy bộ đếm ngược thời gian
  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  // Lệnh gửi mã OTP (dùng chung cho cả bước 1 và nút Gửi lại OTP)
  const sendOTPRequest = async () => {
    setError('');
    setMessage('Đang xử lý gửi mã OTP...');
    try {
      const res = await axios.post('http://localhost:5000/api/auth/forgot-password', { email, phone });
      setMessage(res.data.message || 'Mã OTP 6 số đã được gửi tới Email của bạn!');
      setStep(2);
      setCountdown(30); // Khởi chạy đếm ngược 30 giây
    } catch (err) {
      setMessage('');
      setError(err.response?.data?.message || 'Không thể xác minh thông tin tài khoản!');
    }
  };

  const handleRequestOTP = (e) => {
    e.preventDefault();
    sendOTPRequest();
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.post('http://localhost:5000/api/auth/reset-password', { email, otp, newPassword });
      alert(res.data.message || 'Mật khẩu đã được cập nhật thành công!');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Mã OTP không hợp lệ hoặc đã hết hạn!');
    }
  };

  return (
    <div style={styles.bgContainer}>
      <motion.div 
        initial={{ opacity: 0, y: 35, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        style={styles.card}
      >
        <div style={styles.header}>
          <div style={styles.logoBadge}><KeyRound size={28} color="#9333ea" /></div>
          <h2 style={styles.title}>KHÔI PHỤC MẬT KHẨU</h2>
          <p style={styles.subtitle}>Xác thực 2 yếu tố (2FA Security)</p>
        </div>

        {message && <div style={styles.infoBox}>{message}</div>}
        {error && <div style={styles.errorBox}>{error}</div>}

        {step === 1 ? (
          <form onSubmit={handleRequestOTP} style={styles.form}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Email đăng ký</label>
              <div style={styles.inputWrapper}>
                <Mail size={18} color="#94a3b8" style={styles.icon} />
                <input 
                  type="email" 
                  name="email"
                  autoComplete="email"
                  placeholder="name@company.com" 
                  value={email} 
                  onChange={e => setEmail(e.target.value)} 
                  required 
                  style={styles.input} 
                />
              </div>
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Số điện thoại xác minh</label>
              <div style={styles.inputWrapper}>
                <Phone size={18} color="#94a3b8" style={styles.icon} />
                <input 
                  type="tel" 
                  name="phone"
                  autoComplete="tel"
                  placeholder="0901234567" 
                  value={phone} 
                  onChange={e => setPhone(e.target.value)} 
                  required 
                  style={styles.input} 
                />
              </div>
            </div>

            <button type="submit" style={styles.submitBtn}>Gửi Mã Xác Thực OTP 6 Số</button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} style={styles.form}>
            <div style={styles.inputGroup}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label style={styles.label}>Mã OTP 6 chữ số (Gửi về Email)</label>
                
                {/* Nút đếm ngược 30s & Gửi lại OTP */}
                {countdown > 0 ? (
                  <span style={styles.resendText}>Gửi lại sau <b>{countdown}s</b></span>
                ) : (
                  <button 
                    type="button" 
                    onClick={sendOTPRequest} 
                    style={styles.resendBtn}
                  >
                    <RefreshCw size={12} />
                    <span>Gửi lại OTP</span>
                  </button>
                )}
              </div>

              <input 
                type="text" 
                placeholder="123456" 
                value={otp} 
                onChange={e => setOtp(e.target.value)} 
                required 
                maxLength={6} 
                style={{ ...styles.input, paddingLeft: '12px', fontSize: '18px', textAlign: 'center', letterSpacing: '6px', fontWeight: 'bold' }} 
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Mật khẩu mới</label>
              <input 
                type="password" 
                name="newPassword"
                autoComplete="new-password"
                placeholder="••••••••" 
                value={newPassword} 
                onChange={e => setNewPassword(e.target.value)} 
                required 
                style={{ ...styles.input, paddingLeft: '12px' }} 
              />
            </div>

            <button type="submit" style={{ ...styles.submitBtn, backgroundColor: '#16a34a' }}>
              <CheckCircle2 size={18} />
              <span>Cập Nhật Mật Khẩu</span>
            </button>
          </form>
        )}

        <div style={styles.footer}>
          <Link to="/login" style={styles.backLink}>
            <ArrowLeft size={16} />
            <span>Quay lại Đăng nhập</span>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

const styles = {
  bgContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    fontFamily: "'Segoe UI', sans-serif",
    backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.55), rgba(15, 23, 42, 0.55)), url('https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1920&q=80')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat'
  },
  card: { backgroundColor: '#ffffff', padding: '36px', borderRadius: '16px', width: '100%', maxWidth: '400px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.4)' },
  header: { textAlign: 'center', marginBottom: '24px' },
  logoBadge: { width: '50px', height: '50px', backgroundColor: '#faf5ff', borderRadius: '12px', display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '0 auto 12px' },
  title: { fontSize: '20px', fontWeight: '800', color: '#0f172a', margin: 0 },
  subtitle: { fontSize: '13px', color: '#64748b', marginTop: '4px' },
  infoBox: { backgroundColor: '#eff6ff', borderLeft: '4px solid #2563eb', color: '#1e40af', padding: '10px 14px', borderRadius: '6px', fontSize: '13px', marginBottom: '16px' },
  errorBox: { backgroundColor: '#fef2f2', borderLeft: '4px solid #ef4444', color: '#991b1b', padding: '10px 14px', borderRadius: '6px', fontSize: '13px', marginBottom: '16px' },
  form: { display: 'flex', flexDirection: 'column', gap: '16px' },
  inputGroup: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label: { fontSize: '12px', fontWeight: '600', color: '#334155' },
  inputWrapper: { position: 'relative', display: 'flex', alignItems: 'center' },
  icon: { position: 'absolute', left: '12px' },
  input: { width: '100%', padding: '10px 12px 10px 38px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none', boxSizing: 'border-box' },
  resendText: { fontSize: '12px', color: '#64748b' },
  resendBtn: { background: 'none', border: 'none', color: '#9333ea', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', padding: 0 },
  submitBtn: { display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', width: '100%', padding: '11px', backgroundColor: '#9333ea', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer', marginTop: '8px' },
  footer: { textAlign: 'center', marginTop: '24px' },
  backLink: { display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#64748b', fontSize: '13px', textDecoration: 'none', fontWeight: '600' }
};