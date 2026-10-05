const mongoose = require('mongoose');

const stockImportSchema = new mongoose.Schema(
    {
        importCode: { type: String, required: true, unique: true },
        supplier: { type: String, default: 'Nhà cung cấp Mặc định' },
        items: [
            {
                variantId: { type: mongoose.Schema.Types.ObjectId, ref: 'ProductVariant' },
                quantity: { type: Number, required: true },
                costPrice: { type: Number, required: true } // Giá vốn/Giá nhập
            }
        ],
        totalCost: { type: Number, required: true },
        importDate: { type: Date, default: Date.now }
    },
    { timestamps: true }
);

module.exports = mongoose.model('StockImport', stockImportSchema);