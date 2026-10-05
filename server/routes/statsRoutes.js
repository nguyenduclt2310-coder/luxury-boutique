const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const ProductVariant = require('../models/ProductVariant');

// Lấy số liệu thống kê tổng quan cho Dashboard
router.get('/dashboard', async (req, res) => {
    try {
        // 1. Thống kê tổng số đơn hàng & Doanh thu thực tế (chỉ tính đơn đã thanh toán/hoàn thành)
        const orders = await Order.find();
        const totalOrders = orders.length;
        const totalRevenue = orders
            .filter((o) => o.orderStatus === 'delivered' || o.paymentStatus === 'paid')
            .reduce((sum, o) => sum + (o.totalAmount || 0), 0);

        const pendingOrders = orders.filter((o) => o.orderStatus === 'pending').length;

        // 2. Cảnh báo tồn kho thấp (sản phẩm có stock < 5)
        const lowStockVariants = await ProductVariant.find({ stock: { $lt: 5 } }).populate('productId');

        // 3. Lấy 5 đơn hàng mới nhất
        const recentOrders = await Order.find().sort({ createdAt: -1 }).limit(5);

        res.json({
            success: true,
            data: {
                totalRevenue,
                totalOrders,
                pendingOrders,
                lowStockCount: lowStockVariants.length,
                recentOrders,
                lowStockVariants,
            },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;