const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
    },
    variantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ProductVariant',
        required: true,
    },
    productName: { type: String, required: true }, // Lưu lại đề phòng sản phẩm gốc bị đổi tên
    sku: { type: String, required: true },
    attributes: {
        size: String,
        color: String,
    },
    priceAtPurchase: { type: Number, required: true }, // Giá tại thời điểm chốt đơn
    quantity: { type: Number, required: true, min: 1 },
});

const orderSchema = new mongoose.Schema(
    {
        orderNumber: {
            type: String,
            required: true,
            unique: true,
            uppercase: true,
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: null, // null nếu là khách vãng lai đặt không cần acc
        },
        items: [orderItemSchema],
        customerInfo: {
            fullName: { type: String, required: true, trim: true },
            email: { type: String, required: true, lowercase: true, trim: true },
            phone: { type: String, required: true, trim: true },
            address: {
                street: { type: String, required: true },
                ward: { type: String, default: '' },
                district: { type: String, default: '' },
                city: { type: String, required: true },
            },
        },
        subTotal: { type: Number, required: true }, // Tổng tiền hàng
        shippingFee: { type: Number, default: 0 },   // Phí vận chuyển
        discountAmount: { type: Number, default: 0 },// Tiền giảm giá
        totalAmount: { type: Number, required: true },// Tổng thanh toán cuối

        paymentMethod: {
            type: String,
            enum: ['COD', 'VNPAY', 'MOMO', 'BANK_TRANSFER'],
            default: 'COD',
        },
        paymentStatus: {
            type: String,
            enum: ['pending', 'paid', 'failed', 'refunded'],
            default: 'pending',
        },
        orderStatus: {
            type: String,
            enum: [
                'pending',     // Chờ xác nhận
                'confirmed',   // Đã xác nhận
                'packing',     // Đang đóng gói
                'shipping',    // Đang giao
                'delivered',   // Đã giao
                'cancelled',   // Đã hủy
                'returned',    // Trả hàng/Hoàn tiền
            ],
            default: 'pending',
        },
        trackingCode: { type: String, default: '' }, // Mã vận đơn từ GHN/GHTK
        notes: { type: String, default: '' },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);