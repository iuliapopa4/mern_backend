const express = require('express');
const router = express.Router();
const groupController = require('../controllers/groupController');

router.get('/', groupController.getGroups);
router.get('/:id', groupController.getGroupById);
router.post('/create', groupController.createGroup);
router.post('/add-member', groupController.addGroupMember);
router.delete('/remove-member', groupController.removeGroupMember);
router.put('/:id', groupController.updateGroup);
router.delete('/:id', groupController.deleteGroup);

module.exports = router;
