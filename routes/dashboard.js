const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const requireLogin = require('../middleware/requireLogin');

router.get('/', requireLogin, dashboardController.showDashboard);

module.exports = router;