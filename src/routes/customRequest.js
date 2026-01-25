const express = require('express');
const router = express.Router();
const customRequestController = require('../controllers/customRequest.controller');

router.post('/', customRequestController.createRequest);

module.exports = router;
