
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userPage.controller');
const {verifySessionFunction} = require('../utils/functions/userSessionFunctions');

// we use a middleware to verify the session before loading orders
router.get('/', verifySessionFunction, userController.loadOrdersUser);
module.exports = router;