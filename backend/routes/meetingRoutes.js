const express = require('express');
const meetingController = require('../controllers/meetingController');
const router = express.Router();

router.get('/getMeetingByDate', meetingController.getMeetingByDate);

router.get('/getMeetingById/:id', meetingController.getMeetingById);

router.post('/createMeeting', meetingController.createMeeting);

router.delete('/deleteMeeting/:id', meetingController.deleteMeeting);

module.exports = router;