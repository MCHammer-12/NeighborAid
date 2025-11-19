const express = require('express');
const router = express.Router();
const householdController = require('../controllers/householdController');
const requireLogin = require('../middleware/requireLogin');

// View household details
router.get('/view', requireLogin, householdController.showProfile);

// Edit form
router.get('/edit/:id', requireLogin, householdController.showEditForm);

// Save edits
router.post('/update', requireLogin, householdController.updateProfile);

module.exports = router;