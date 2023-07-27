const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const isAdminMiddleware = require('../middlewares/authorization');
const extractUserRole = require('../middlewares/extractUserRole');
const authMiddleware = require('../middlewares/auth');

router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);
router.get('/', userController.getUsers);
router.get('/:id', userController.getUserById);

router.get('/:id/name', userController.getUserNameById);

router.use(extractUserRole);
router.put('/:id', isAdminMiddleware, userController.updateUser);
router.delete('/:id', isAdminMiddleware, userController.deleteUser);


module.exports = router;
