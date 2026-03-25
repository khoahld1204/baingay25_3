const Inventory = require('../models/Inventory');

// Get all inventory
exports.getAllInventory = async (req, res) => {
    try {
        const inventories = await Inventory.find().populate('product');
        res.status(200).json(inventories);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching inventories', error: error.message });
    }
};

// Get inventory by ID (with product join)
exports.getInventoryById = async (req, res) => {
    try {
        const { id } = req.params;
        const inventory = await Inventory.findById(id).populate('product');
        if (!inventory) {
            return res.status(404).json({ message: 'Inventory not found' });
        }
        res.status(200).json(inventory);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching inventory', error: error.message });
    }
};

// Add Stock (POST)
// Expected Body: { product: "productId", quantity: number }
exports.addStock = async (req, res) => {
    try {
        const { product, quantity } = req.body;
        if (!quantity || quantity <= 0) {
            return res.status(400).json({ message: 'Quantity must be greater than 0' });
        }
        
        const inventory = await Inventory.findOneAndUpdate(
            { product: product },
            { $inc: { stock: quantity } },
            { new: true, runValidators: true }
        ).populate('product');

        if (!inventory) {
            return res.status(404).json({ message: 'Inventory for this product not found' });
        }
        
        res.status(200).json({ message: 'Stock added successfully', inventory });
    } catch (error) {
        res.status(500).json({ message: 'Error adding stock', error: error.message });
    }
};

// Remove Stock (POST)
// Expected Body: { product: "productId", quantity: number }
exports.removeStock = async (req, res) => {
    try {
        const { product, quantity } = req.body;
        if (!quantity || quantity <= 0) {
            return res.status(400).json({ message: 'Quantity must be greater than 0' });
        }

        const inventory = await Inventory.findOne({ product });
        if (!inventory) {
            return res.status(404).json({ message: 'Inventory for this product not found' });
        }

        if (inventory.stock < quantity) {
            return res.status(400).json({ message: 'Not enough stock to remove' });
        }

        inventory.stock -= quantity;
        await inventory.save();

        res.status(200).json({ message: 'Stock removed successfully', inventory });
    } catch (error) {
        res.status(500).json({ message: 'Error removing stock', error: error.message });
    }
};

// Reservation (POST): Giảm stock, tăng reserved
// Expected Body: { product: "productId", quantity: number }
exports.reserveStock = async (req, res) => {
    try {
        const { product, quantity } = req.body;
        if (!quantity || quantity <= 0) {
            return res.status(400).json({ message: 'Quantity must be greater than 0' });
        }

        const inventory = await Inventory.findOne({ product });
        if (!inventory) {
            return res.status(404).json({ message: 'Inventory for this product not found' });
        }

        if (inventory.stock < quantity) {
            return res.status(400).json({ message: 'Not enough stock to reserve' });
        }

        inventory.stock -= quantity;
        inventory.reserved += quantity;
        await inventory.save();

        res.status(200).json({ message: 'Stock reserved successfully', inventory });
    } catch (error) {
        res.status(500).json({ message: 'Error reserving stock', error: error.message });
    }
};

// Sold (POST): Giảm reservation, tăng soldCount
// Expected Body: { product: "productId", quantity: number }
exports.soldStock = async (req, res) => {
    try {
        const { product, quantity } = req.body;
        if (!quantity || quantity <= 0) {
            return res.status(400).json({ message: 'Quantity must be greater than 0' });
        }

        const inventory = await Inventory.findOne({ product });
        if (!inventory) {
            return res.status(404).json({ message: 'Inventory for this product not found' });
        }

        if (inventory.reserved < quantity) {
            return res.status(400).json({ message: 'Not enough reserved stock to sell' });
        }

        inventory.reserved -= quantity;
        inventory.soldCount += quantity;
        await inventory.save();

        res.status(200).json({ message: 'Stock sold successfully', inventory });
    } catch (error) {
        res.status(500).json({ message: 'Error processing sale', error: error.message });
    }
};
