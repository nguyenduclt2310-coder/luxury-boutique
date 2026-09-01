const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_jwt_key_123';

// Cấu hình Nodemailer gửi Email OTP
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'nguyenduclt2310@gmail.com', // Gmail máy chủ dùng để gửi thư đi
        pass: 'tidswgqnbjnzwocf'          // Mật khẩu ứng dụng (App Password 16 ký tự)
    },
    tls: {
        rejectUnauthorized: false
    }
});

// 1. Đăng ký Tài khoản (Mặc định 'Customer' nếu không truyền role)
router.post('/register', async (req, res) => {
    try {
        const { name, email, phone, password, role } = req.body;
        const cleanEmail = email ? email.trim().toLowerCase() : '';
        const cleanPhone = phone ? phone.trim() : '';

        const existingUser = await User.findOne({ email: cleanEmail });
        if (existingUser) {
            return res.status(400).json({ message: 'Email này đã tồn tại trong hệ thống!' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            name: name ? name.trim() : '',
            email: cleanEmail,
            phone: cleanPhone,
            password: hashedPassword,
            role: role || 'Customer' // Phân quyền linh hoạt (Customer, Staff, Manager, Admin)
        });

        await newUser.save();
        res.status(201).json({ message: 'Đăng ký tài khoản thành công!' });
    } catch (err) {
        res.status(500).json({ message: 'Lỗi đăng ký: ' + err.message });
    }
});

// 2. Đăng nhập & Tạo Token JWT
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const cleanEmail = email ? email.trim().toLowerCase() : '';

        const user = await User.findOne({ email: cleanEmail });
        if (!user) {
            return res.status(400).json({ message: 'Tài khoản không tồn tại!' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Mật khẩu không chính xác!' });
        }

        const token = jwt.sign(
            { id: user._id, role: user.role, name: user.name, phone: user.phone },
            JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.json({
            token,
            user: { id: user._id, name: user.name, email: user.email, phone: user.phone, role: user.role }
        });
    } catch (err) {
        res.status(500).json({ message: 'Lỗi đăng nhập: ' + err.message });
    }
});

// 3. Yêu cầu mã OTP Quên Mật Khẩu (Gửi động đến đúng Email đã đăng ký)
router.post('/forgot-password', async (req, res) => {
    try {
        const { email, phone } = req.body;

        const cleanEmail = email ? email.trim().toLowerCase() : '';
        const cleanPhone = phone ? phone.trim() : '';

        // Tìm User không phân biệt hoa/thường và đã làm sạch khoảng trắng
        const user = await User.findOne({
            email: { $regex: new RegExp(`^${cleanEmail}$`, 'i') },
            phone: cleanPhone
        });

        if (!user) {
            return res.status(404).json({ message: 'Thông tin Email hoặc Số điện thoại không khớp với hệ thống!' });
        }

        // Tạo mã OTP 6 chữ số ngẫu nhiên
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        user.otpCode = otp;
        user.otpExpires = Date.now() + 5 * 60 * 1000; // Hiệu lực 5 phút
        await user.save();

        // Gửi Mail HTML tới địa chỉ Email người dùng nhập (cleanEmail)
        await transporter.sendMail({
            from: '"Hệ Thống Quản Trị Enterprise" <nguyenduclt2310@gmail.com>',
            to: cleanEmail,
            subject: `[OTP BẢO MẬT] - Khôi phục mật khẩu tài khoản (${otp})`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 10px; background-color: #ffffff;">
                    <div style="text-align: center; margin-bottom: 20px;">
                        <h2 style="color: #2563eb; margin: 0;">MÃ XÁC THỰC KHÔI PHỤC MẬT KHẨU</h2>
                        <p style="color: #64748b; font-size: 13px;">Xác minh danh tính 2 lớp (2FA Security)</p>
                    </div>

                    <p>Xin chào <b>${user.name || 'Thành viên'}</b>,</p>
                    <p>Hệ thống nhận được yêu cầu cấp lại mật khẩu cho tài khoản <b>${user.email}</b> (Vai trò: <b>${user.role}</b>).</p>
                    <p>Vui lòng nhập mã OTP bên dưới để hoàn tất:</p>

                    <div style="text-align: center; margin: 24px 0;">
                        <span style="font-size: 30px; font-weight: bold; letter-spacing: 8px; color: #0f172a; background-color: #f1f5f9; padding: 12px 24px; border-radius: 8px; border: 1px dashed #cbd5e1; display: inline-block;">
                            ${otp}
                        </span>
                    </div>

                    <p style="color: #ef4444; font-size: 12px; text-align: center;">Mã này có hiệu lực trong vòng <b>5 phút</b>. Vui lòng không tiết lộ cho ai khác.</p>
                    <hr style="border: none; border-top: 1px solid #f1f5f9; margin: 20px 0;" />
                    <p style="color: #94a3b8; font-size: 11px; text-align: center; margin: 0;">Email tự động gửi từ Hệ thống Quản trị Enterprise ERP.</p>
                </div>
            `
        });

        res.json({ message: `Mã OTP đã được gửi thành công đến hộp thư: ${cleanEmail}` });
    } catch (err) {
        console.error("Lỗi gửi email:", err);
        res.status(500).json({ message: 'Không thể gửi email OTP lúc này. Vui lòng thử lại sau!' });
    }
});

// 4. Xác nhận OTP & Đổi Mật Khẩu Mới
router.post('/reset-password', async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;
        const cleanEmail = email ? email.trim().toLowerCase() : '';
        const cleanOtp = otp ? otp.trim() : '';

        const user = await User.findOne({
            email: { $regex: new RegExp(`^${cleanEmail}$`, 'i') },
            otpCode: cleanOtp,
            otpExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: 'Mã OTP không chính xác hoặc đã hết hạn!' });
        }

        user.password = await bcrypt.hash(newPassword, 10);
        user.otpCode = undefined;
        user.otpExpires = undefined;
        await user.save();

        res.json({ message: 'Cập nhật mật khẩu mới thành công! Bạn có thể đăng nhập ngay.' });
    } catch (err) {
        res.status(500).json({ message: 'Lỗi cập nhật mật khẩu: ' + err.message });
    }
});

module.exports = router;