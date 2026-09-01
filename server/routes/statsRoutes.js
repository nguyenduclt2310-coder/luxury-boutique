const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

router.get('/summary', async (req, res) => {
    try {
        const totalProducts = await Product.countDocuments();
        const products = await Product.find();

        // Tính tổng giá trị toàn bộ sản phẩm
        const totalInventoryValue = products.reduce((acc, p) => acc + (p.price * p.stock), 0);
        const outOfStockCount = products.filter(p => p.stock === 0).length;

        // Gom nhóm tổng giá trị sản phẩm nhập theo từng tháng thực tế
        const monthlyData = await Product.aggregate([
            {
                $group: {
                    _id: { $month: "$createdAt" },
                    revenue: { $sum: { $multiply: ["$price", "$stock"] } }
                }
            },
            { $sort: { "_id": 1 } }
        ]);

        const monthlyRevenue = monthlyData.map(item => ({
            month: `Tháng ${item._id}`,
            revenue: item.revenue
        }));

        res.json({
            totalProducts,
            totalInventoryValue,
            outOfStockCount,
            totalOrders: totalProducts,
            monthlyRevenue: monthlyRevenue.length > 0 ? monthlyRevenue : [{ month: 'Tháng này', revenue: totalInventoryValue }]
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;