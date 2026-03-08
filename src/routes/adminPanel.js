const express = require('express');
const router = express.Router();
const {fillDashboard, addNewProductController,updateStock,acceptCustomOrder} = require('../controllers/adminPanel.controller');


router.get('/', fillDashboard);
router.post('/add-product', addNewProductController);
router.put('/update-stock', updateStock);
router.put('/accept-custom-order/:id_request', acceptCustomOrder);
module.exports = router;