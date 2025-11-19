const express = require('express');
const router = express.Router();
const skills = require('../controllers/skillController');

router.get('/', skills.listSkills);
router.get('/add', skills.showAddSkill);
router.post('/add', skills.addSkill);
router.get('/edit/:id', skills.showEditSkill);
router.post('/update/:id', skills.updateSkill);
router.post('/delete/:id', skills.deleteSkill);

module.exports = router;