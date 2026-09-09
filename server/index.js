const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db');

const app = express();

// Middleware CORS cho phép domain chính thức và localhost
const allowedOrigins = [
    'https://luxuryboutique.id.vn',
    'https://www.luxuryboutique.id.vn',
    'https://admin.luxuryboutique.id.vn',
    'http://localhost:5173',
    'http://localhost:3000'
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('CORS policy blocked this request'));
        }
    },
    credentials: true
}));

app.use(express.json());

// Connect Database
connectDB();

// Routes
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/stats', require('./routes/statsRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));

app.get('/', (req, res) => {
    res.send('API Server Admin Dashboard đang chạy...');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server chạy tại port ${PORT}`));