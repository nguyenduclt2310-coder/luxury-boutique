const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        slug: { type: String, required: true, unique: true },
        basePrice: { type: Number, required: true },
        salePrice: { type: Number, default: null }, // Giá khuyến mãi
        flashSaleEnd: { type: Date, default: null }, // Đếm ngược Flash Sale
        description: { type: String, default: '' },
        brand: { type: String, default: 'Luxury Boutique' },
        category: { type: String, default: 'Thời trang' },
        collectionName: { type: String, default: '' }, // BST Thu Đông 2026,...
        tags: [{ type: String }], // New Arrival, Best Seller, Limited Edition
        sizeChart: {
            shoulder: String,
            chest: String,
            length: String
        },
        images: [{ type: String }],
        status: { type: String, enum: ['active', 'archived'], default: 'active' }
    },
    { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);