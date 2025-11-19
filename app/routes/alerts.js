const express = require('express');
const router = express.Router();
const requireLogin = require('../middleware/requireLogin');

router.get('/', requireLogin, (req, res) => {
  res.render('alerts', {
    user: req.user
  });
});

module.exports = router;