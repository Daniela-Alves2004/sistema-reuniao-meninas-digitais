const express = require('express');
const minutesController = require('../controllers/minutesController');
const router = express.Router();
const authenticate = require('../middlewares/authenticate');

router.post('/createMinutes', authenticate, minutesController.createMinutes);
router.get('/listMinutesByMeeting/:id', minutesController.listMinutesByMeeting);

module.exports = router;