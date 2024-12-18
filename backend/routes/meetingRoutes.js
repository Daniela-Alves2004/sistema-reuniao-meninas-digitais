const express = require('express');
const meetingController = require('../controllers/meetingController');
const router = express.Router();
const authenticate = require('../middlewares/authenticate');

router.post('/createMeeting', meetingController.createMeeting, authenticate);

module.exports = router;