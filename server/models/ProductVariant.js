const mongoose = require('mongoose');

const productVariantSchema = new mongoose.Schema(
    {
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        sku: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },
        attributes: {
            size: { type: String, default: 'FREE' },
            color: { type: String, default: 'Mặc định' }
        },
        price: {
            type: Number,
            required: true
        },
        stock: {
            type: Number,
            default: 0,
            min: 0
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model('ProductVariant', productVariantSchema);