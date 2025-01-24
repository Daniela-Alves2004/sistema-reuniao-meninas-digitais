const express = require('express');
const meetingController = require('../controllers/meetingController');
const router = express.Router();

router.get('/getMeetingByDate', meetingController.getMeetingByDate);

router.post('/createMeeting', meetingController.createMeeting);

module.exports = router;