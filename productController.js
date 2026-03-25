const Product = require('../models/Product');
const Inventory = require('../models/Inventory');

// Create a new product and automatically create its inventory
exports.createProduct = async (req, res) => {
    try {
        const { name, price, description } = req.body;
        
        // 1. Create Product
        const newProduct = new Product({ name, price, description });
        const savedProduct = await newProduct.save();

        // 2. Automatically create its corresponding inventory
        const newInventory = new Inventory({
            product: savedProduct._id,
            stock: 0,
            reserved: 0,
            soldCount: 0
        });
        await newInventory.save();

        res.status(201).json({
            message: 'Product and corresponding Inventory created successfully',
            product: savedProduct,
            inventory: newInventory
        });
    } catch (error) {
        res.status(500).json({ message: 'Error creating product', error: error.message });
    }
};

// Get all products
exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching products', error: error.message });
    }
};
