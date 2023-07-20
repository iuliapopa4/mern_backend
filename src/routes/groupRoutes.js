const express = require('express');
const router = express.Router();
const groupController = require('../controllers/groupController');
const isAdminMiddleware = require('../middlewares/authorization');
const extractUserRole = require('../middlewares/extractUserRole');

router.get('/', groupController.getGroups);
router.get('/:id', groupController.getGroupById);

router.use(extractUserRole);
router.post('/create', isAdminMiddleware, groupController.createGroup);
router.post('/add-member', isAdminMiddleware, groupController.addGroupMember);
router.delete('/remove-member', isAdminMiddleware, groupController.removeGroupMember);
router.put('/:id', isAdminMiddleware, groupController.updateGroup);
router.delete('/:id', isAdminMiddleware, groupController.deleteGroup);

module.exports = router;
