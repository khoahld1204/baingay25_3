const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');

// Get all inventory
router.get('/', inventoryController.getAllInventory);

// Get inventory by ID
router.get('/:id', inventoryController.getInventoryById);

// Add Stock
router.post('/add_stock', inventoryController.addStock);

// Remove Stock
router.post('/remove_stock', inventoryController.removeStock);

// Reserve Stock
router.post('/reservation', inventoryController.reserveStock);

// Sold Stock
router.post('/sold', inventoryController.soldStock);

module.exports = router;
