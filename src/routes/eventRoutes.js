const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const isAdminMiddleware = require('../middlewares/authorization');
const extractUserRole = require('../middlewares/extractUserRole');


router.get('/', eventController.getEvents);
router.get('/:id', eventController.getEventById);

router.use(extractUserRole);
router.post('/', isAdminMiddleware, eventController.createEvent);
router.put('/:id', isAdminMiddleware, eventController.updateEvent);
router.delete('/:id', isAdminMiddleware, eventController.deleteEvent);
router.post('/send-invitation', isAdminMiddleware, eventController.sendInvitation);
router.post('/add-member', isAdminMiddleware, eventController.addMemberToEvent);
router.post('/remove-member', isAdminMiddleware, eventController.removeMemberFromEvent);


module.exports = router;
