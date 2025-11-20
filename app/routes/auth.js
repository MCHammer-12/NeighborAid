const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// LOGIN
router.get('/login', authController.showLogin);
router.post('/login', authController.handleLogin);

// REGISTER
router.get('/register', authController.showRegister);
router.post('/register', authController.handleRegister);

// LOGOUT
router.post('/logout', authController.logout);

module.exports = router;