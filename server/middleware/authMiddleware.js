const jwt = require('jsonwebtoken');
const JWT_SECRET = 'your_super_secret_jwt_key_123';

const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ message: 'Bạn chưa đăng nhập!' });

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) return res.status(403).json({ message: 'Token hết hạn hoặc không hợp lệ!' });
        req.user = decoded;
        next();
    });
};

const checkRole = (roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Bạn không có quyền thực hiện thao tác này!' });
        }
        next();
    };
};

module.exports = { verifyToken, checkRole };