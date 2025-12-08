const express = require('express');
const router = express.Router();
const resourcesController = require('../controllers/resourcesController');
const requireLogin = require('../middleware/requireLogin');

// list
router.get('/', requireLogin, resourcesController.listResources);

// add form
router.get('/add', requireLogin, resourcesController.showAddForm);

// add submit
router.post('/add', requireLogin, resourcesController.handleAdd);

// edit form
router.get('/edit/:id', requireLogin, resourcesController.showEditForm);

// update submit
router.post('/update/:id', requireLogin, resourcesController.handleUpdate);

// delete
router.post('/delete/:id', requireLogin, resourcesController.handleDelete);

module.exports = router;