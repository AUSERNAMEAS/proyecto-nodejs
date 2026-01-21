const express = require('express');
const router = express.Router();
const customRequestController = require('../controllers/customRequest.controller');
// here we import the controller logic and just call the function in the route

router.post('/', customRequestController.createRequest);

module.exports = router;
