const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const ProductVariant = require('../models/ProductVariant');

// Helper: Tự động tạo Slug SEO chuẩn tiếng Việt
const slugify = (text) => {
    return text
        .toString()
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[đĐ]/g, 'd')
        .replace(/([^0-9a-z-\s])/g, '')
        .replace(/(\s+)/g, '-')
        .replace(/^-+|-+$/g, '');
};

// 1. LẤY DANH SÁCH SẢN PHẨM (Search, Filter status/category/collection/price, Pagination)
router.get('/', async (req, res) => {
    try {
        const {
            search,
            category,
            collectionName,
            status = 'active',
            page = 1,
            limit = 8,
            minPrice,
            maxPrice
        } = req.query;

        const query = {};

        if (status !== 'all') {
            query.status = status;
        }

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { tags: { $in: [new RegExp(search, 'i')] } }
            ];
        }

        if (category) query.category = category;
        if (collectionName) query.collectionName = collectionName;

        if (minPrice || maxPrice) {
            query.basePrice = {};
            if (minPrice) query.basePrice.$gte = Number(minPrice);
            if (maxPrice) query.basePrice.$lte = Number(maxPrice);
        }

        const skip = (Number(page) - 1) * Number(limit);

        const [products, total] = await Promise.all([
            Product.find(query).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
            Product.countDocuments(query)
        ]);

        const productIds = products.map((p) => p._id);
        const variants = await ProductVariant.find({ productId: { $in: productIds } });

        const data = products.map((product) => {
            const productVariants = variants.filter(
                (v) => v.productId.toString() === product._id.toString()
            );
            return { ...product.toObject(), variants: productVariants };
        });

        res.json({
            success: true,
            data,
            pagination: {
                total,
                page: Number(page),
                pages: Math.ceil(total / Number(limit)),
                limit: Number(limit)
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Lỗi server: ' + error.message });
    }
});

// 2. LẤY CHI TIẾT 1 SẢN PHẨM THEO ID (Kèm mảng biến thể)
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy sản phẩm' });
        }

        const variants = await ProductVariant.find({ productId: product._id });

        res.json({
            success: true,
            data: {
                ...product.toObject(),
                variants
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// 3. THÊM SẢN PHẨM MỚI (Hỗ trợ Tags, Size Chart, Collection & Pass Validation)
router.post('/', async (req, res) => {
    try {
        const {
            name,
            basePrice,
            salePrice,
            flashSaleEnd,
            description,
            brand,
            category,
            collectionName,
            tags,
            sizeChart,
            images,
            variants
        } = req.body;

        if (!name || basePrice === undefined) {
            return res.status(400).json({ success: false, message: 'Tên và giá sản phẩm là bắt buộc' });
        }

        const baseSlug = slugify(name);
        const slug = `${baseSlug}-${Date.now().toString().slice(-4)}`;
        const numericPrice = Number(basePrice);

        const newProduct = await Product.create({
            name,
            slug,
            brand: brand || 'Luxury Boutique',
            category: category || 'Thời trang',
            collectionName: collectionName || '',
            basePrice: numericPrice,
            price: numericPrice,
            salePrice: salePrice ? Number(salePrice) : null,
            flashSaleEnd: flashSaleEnd || null,
            tags: tags || [],
            sizeChart: sizeChart || {},
            description: description || '',
            images: images && images.length > 0 ? images : ['https://via.placeholder.com/300'],
            status: 'active'
        });

        if (variants && Array.isArray(variants) && variants.length > 0) {
            const variantDocs = variants.map((v, idx) => ({
                productId: newProduct._id,
                sku: v.sku || `${baseSlug.toUpperCase().slice(0, 6)}-${(v.size || 'FREE').toUpperCase()}-${idx + 1}`,
                attributes: {
                    size: v.size || 'FREE',
                    color: v.color || 'Mặc định'
                },
                price: v.price ? Number(v.price) : numericPrice,
                stock: Number(v.stock) || 0
            }));

            await ProductVariant.insertMany(variantDocs);
        }

        res.status(201).json({
            success: true,
            message: 'Tạo sản phẩm mới thành công',
            data: newProduct
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

// 4. CẬP NHẬT SẢN PHẨM & BIẾN THỂ (PUT)
router.put('/:id', async (req, res) => {
    try {
        const {
            name,
            basePrice,
            salePrice,
            flashSaleEnd,
            description,
            brand,
            category,
            collectionName,
            tags,
            sizeChart,
            images,
            variants
        } = req.body;

        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy sản phẩm' });
        }

        if (name) product.name = name;
        if (basePrice !== undefined) {
            product.basePrice = Number(basePrice);
            product.price = Number(basePrice);
        }
        if (salePrice !== undefined) product.salePrice = salePrice ? Number(salePrice) : null;
        if (flashSaleEnd !== undefined) product.flashSaleEnd = flashSaleEnd;
        if (description !== undefined) product.description = description;
        if (brand !== undefined) product.brand = brand;
        if (category !== undefined) product.category = category;
        if (collectionName !== undefined) product.collectionName = collectionName;
        if (tags !== undefined) product.tags = tags;
        if (sizeChart !== undefined) product.sizeChart = sizeChart;
        if (images && Array.isArray(images)) product.images = images;

        await product.save();

        if (variants && Array.isArray(variants)) {
            await ProductVariant.deleteMany({ productId: product._id });

            const baseSlug = slugify(product.name);
            const variantDocs = variants.map((v, idx) => ({
                productId: product._id,
                sku: v.sku || `${baseSlug.toUpperCase().slice(0, 6)}-${(v.size || 'FREE').toUpperCase()}-${idx + 1}`,
                attributes: {
                    size: v.size || 'FREE',
                    color: v.color || 'Mặc định'
                },
                price: v.price ? Number(v.price) : Number(product.basePrice),
                stock: Number(v.stock) || 0
            }));

            await ProductVariant.insertMany(variantDocs);
        }

        res.json({
            success: true,
            message: 'Cập nhật sản phẩm thành công',
            data: product
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

// 5. CẬP NHẬT NHANH SỐ LƯỢNG TỒN KHO CHO 1 BIẾN THỂ (PATCH)
router.patch('/variant/:variantId/stock', async (req, res) => {
    try {
        const { stock } = req.body;
        if (stock === undefined || Number(stock) < 0) {
            return res.status(400).json({ success: false, message: 'Số lượng tồn kho không hợp lệ' });
        }

        const variant = await ProductVariant.findByIdAndUpdate(
            req.params.variantId,
            { stock: Number(stock) },
            { new: true }
        );

        if (!variant) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy biến thể' });
        }

        res.json({ success: true, message: 'Cập nhật tồn kho thành công', data: variant });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

// 6. ĐỔI TRẠNG THÁI (ẨN / KHÔI PHỤC)
router.patch('/:id/status', async (req, res) => {
    try {
        const { status } = req.body;
        if (!['active', 'archived'].includes(status)) {
            return res.status(400).json({ success: false, message: 'Trạng thái không hợp lệ' });
        }

        const product = await Product.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );

        res.json({ success: true, message: 'Đổi trạng thái thành công', data: product });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// 7. XÓA VĨNH VIỄN SẢN PHẨM VÀ BIẾN THỂ
router.delete('/:id', async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Sản phẩm không tồn tại' });
        }

        await ProductVariant.deleteMany({ productId: req.params.id });

        res.json({ success: true, message: 'Đã xóa vĩnh viễn sản phẩm và các biến thể' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;