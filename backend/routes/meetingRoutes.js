const express = require('express');
const meetingController = require('../controllers/meetingController');
const router = express.Router();

router.get('/getMeetingByDate', meetingController.getMeetingByDate);

module.exports = router;