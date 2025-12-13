const express = require('express');
const router = express.Router();
const requireLogin = require('../middleware/requireLogin');
const profileController = require('../controllers/profileController');

router.get('/', requireLogin, profileController.showProfile);
router.post('/update', requireLogin, profileController.updateProfile);

module.exports = router;