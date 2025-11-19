const express = require('express');
const router = express.Router();
const directoryController = require('../controllers/directoryController');
const requireLogin = require('../middleware/requireLogin');

router.get('/', requireLogin, directoryController.listHouseholds);

module.exports = router;