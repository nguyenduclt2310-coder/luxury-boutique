const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const ProductVariant = require('../models/ProductVariant');

// Helper: Tạo mã đơn hàng duy nhất (Ví dụ: LX-260917-8A3F)
const generateOrderNumber = () => {
    const dateStr = new Date().toISOString().slice(2, 10).replace(/-/g, '');
    const randomStr = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `LX-${dateStr}-${randomStr}`;
};

// 1. TẠO ĐƠN HÀNG MỚI (Dành cho Checkout / Khách đặt hàng)
router.post('/', async (req, res) => {
    try {
        const { items, customerInfo, paymentMethod, shippingFee = 0, discountAmount = 0, notes } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ success: false, message: 'Giỏ hàng không được để trống' });
        }

        let subTotal = 0;
        const orderItems = [];

        // Duyệt qua từng sản phẩm trong giỏ để kiểm tra tồn kho & tính lại tổng tiền chuẩn
        for (const item of items) {
            const variant = await ProductVariant.findById(item.variantId).populate('productId');

            if (!variant) {
                return res.status(404).json({ success: false, message: `Không tìm thấy biến thể sản phẩm` });
            }

            if (variant.stock < item.quantity) {
                return res.status(400).json({
                    success: false,
                    message: `Sản phẩm ${variant.productId.name} (${variant.attributes.size}/${variant.attributes.color}) chỉ còn ${variant.stock} sản phẩm trong kho.`,
                });
            }

            const itemTotal = variant.price * item.quantity;
            subTotal += itemTotal;

            orderItems.push({
                productId: variant.productId._id,
                variantId: variant._id,
                productName: variant.productId.name,
                sku: variant.sku,
                attributes: {
                    size: variant.attributes.size,
                    color: variant.attributes.color,
                },
                priceAtPurchase: variant.price,
                quantity: item.quantity,
            });

            // Cập nhật tồn kho: Giảm stock thực tế, tăng reservedStock
            variant.stock -= item.quantity;
            variant.reservedStock += item.quantity;
            await variant.save();
        }

        const totalAmount = subTotal + shippingFee - discountAmount;

        // Tạo đơn hàng
        const newOrder = await Order.create({
            orderNumber: generateOrderNumber(),
            userId: req.body.userId || null,
            items: orderItems,
            customerInfo,
            subTotal,
            shippingFee,
            discountAmount,
            totalAmount: totalAmount < 0 ? 0 : totalAmount,
            paymentMethod: paymentMethod || 'COD',
            notes,
        });

        res.status(201).json({
            success: true,
            message: 'Đặt hàng thành công!',
            data: newOrder,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// 2. LẤY DANH SÁCH ĐƠN HÀNG (Dành cho Admin - Có phân trang & lọc trạng thái)
router.get('/', async (req, res) => {
    try {
        const { status, search, page = 1, limit = 10 } = req.query;
        const query = {};

        if (status) query.orderStatus = status;
        if (search) {
            query.$or = [
                { orderNumber: { $regex: search, $options: 'i' } },
                { 'customerInfo.fullName': { $regex: search, $options: 'i' } },
                { 'customerInfo.phone': { $regex: search, $options: 'i' } },
            ];
        }

        const skip = (Number(page) - 1) * Number(limit);
        const orders = await Order.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(Number(limit));

        const total = await Order.countDocuments(query);

        res.json({
            success: true,
            data: orders,
            pagination: {
                total,
                page: Number(page),
                pages: Math.ceil(total / Number(limit)),
            },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// 3. XEM CHI TIẾT 1 ĐƠN HÀNG
router.get('/:id', async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy đơn hàng' });
        }
        res.json({ success: true, data: order });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// 4. CẬP NHẬT TRẠNG THÁI ĐƠN HÀNG / THANH TOÁN (Admin)
router.patch('/:id/status', async (req, res) => {
    try {
        const { orderStatus, paymentStatus, trackingCode } = req.body;
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy đơn hàng' });
        }

        // Nếu ĐƠN HÀNG BỊ HỦY -> Trả lại số lượng tồn kho
        if (orderStatus === 'cancelled' && order.orderStatus !== 'cancelled') {
            for (const item of order.items) {
                const variant = await ProductVariant.findById(item.variantId);
                if (variant) {
                    variant.stock += item.quantity;
                    variant.reservedStock = Math.max(0, variant.reservedStock - item.quantity);
                    await variant.save();
                }
            }
        }

        // Nếu ĐƠN HÀNG GIAO THÀNH CÔNG -> Giải phóng reservedStock
        if (orderStatus === 'delivered' && order.orderStatus !== 'delivered') {
            for (const item of order.items) {
                const variant = await ProductVariant.findById(item.variantId);
                if (variant) {
                    variant.reservedStock = Math.max(0, variant.reservedStock - item.quantity);
                    await variant.save();
                }
            }
            order.paymentStatus = 'paid'; // Tự động đổi trạng thái thanh toán thành đã trả tiền
        }

        if (orderStatus) order.orderStatus = orderStatus;
        if (paymentStatus) order.paymentStatus = paymentStatus;
        if (trackingCode !== undefined) order.trackingCode = trackingCode;

        await order.save();

        res.json({ success: true, message: 'Cập nhật đơn hàng thành công', data: order });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;