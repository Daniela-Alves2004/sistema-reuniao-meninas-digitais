const express = require('express');
const userController = require('../controllers/userController');
const router = express.Router();
const authenticate = require('../middlewares/authenticate');

router.post('/register', userController.registerUser);

router.post('/login', userController.loginUser);

router.delete('/deleteUser/:id', authenticate, userController.deleteUser);

module.exports = router;