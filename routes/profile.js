const express = require('express');
const router = express.Router();
const requireLogin = require('../middleware/requireLogin');
const householdController = require('../controllers/householdController');

router.get('/', requireLogin, householdController.showProfile);

module.exports = router;