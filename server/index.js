const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db');

const app = express();

// Danh sách domain cố định
const allowedOrigins = [
    'https://luxuryboutique.id.vn',
    'https://www.luxuryboutique.id.vn',
    'https://admin.luxuryboutique.id.vn',
    'http://localhost:5173',
    'http://localhost:3000'
];

// Cấu hình CORS mở rộng cho cả Vercel
app.use(cors({
    origin: function (origin, callback) {
        if (
            !origin ||
            allowedOrigins.indexOf(origin) !== -1 ||
            origin.endsWith('.vercel.app')
        ) {
            callback(null, true);
        } else {
            callback(new Error('CORS policy blocked this request'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

app.use(express.json());

// Connect Database
connectDB();

// ==================== ROUTES ====================
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/stats', require('./routes/statsRoutes'));

app.get('/', (req, res) => {
    res.send('API Server Admin Dashboard đang chạy...');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server chạy tại port ${PORT}`));