const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// login form
router.get('/login', (req, res) => {
  res.render('login');
});

// login submit
router.post('/login', authController.handleLogin);

// logout
router.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/auth/login');
  });
});

// register form
router.get('/register', (req, res) => {
  res.send("Register page goes here");
});

module.exports = router;