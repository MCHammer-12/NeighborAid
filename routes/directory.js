const express = require('express');
const router = express.Router();
const directoryController = require('../controllers/directoryController');

// Test route (can remove after testing)
router.get('/map-test', (req, res) => {
  res.send('map route works');
});

// Main directory listing page
router.get('/', directoryController.listHouseholds);

// Map view page
router.get('/map', directoryController.showMap);

// Map data API endpoint
router.get('/map/data', directoryController.getMapData);

module.exports = router;