const express = require('express');
const minutesController = require('../controllers/minutesController');
const router = express.Router();
const authenticate = require('../middlewares/authenticate');

router.post('/createMinutes', authenticate, minutesController.createMinutes);

module.exports = router;