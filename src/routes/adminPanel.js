const express = require('express');
const router = express.Router();
const upload = require("../middleware/upload");

const {fillDashboard, addNewProductController,updateStock,acceptCustomOrder,updateOrderStatusController} = require('../controllers/adminPanel.controller');


router.get('/', fillDashboard);
//upload.single("imagen") is used to handle the file upload for the product image
router.post('/add-product',upload.single("imagen"),addNewProductController);
router.put('/update-stock', updateStock);
router.put('/accept-custom-order/:id_request', acceptCustomOrder);
router.put('/update-order-status', updateOrderStatusController);
module.exports = router;