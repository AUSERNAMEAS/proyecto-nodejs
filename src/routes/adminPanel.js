const express = require('express');
const router = express.Router();
const {fillDashboard, addNewProductController,updateStock} = require('../controllers/adminPanel.controller');


router.get('/', fillDashboard);
router.post('/add-product', addNewProductController);
router.put('/update-stock', updateStock);
module.exports = router;