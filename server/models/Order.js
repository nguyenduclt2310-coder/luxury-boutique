const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
    {
        customerName: { type: String, required: true },
        totalAmount: { type: Number, required: true },
        status: {
            type: String,
            enum: ['Pending', 'Completed', 'Cancelled'],
            default: 'Completed'
        },
        // Trắc nghiệm thời gian thực: Mongodb tự động lưu createdAt
    },
    { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);