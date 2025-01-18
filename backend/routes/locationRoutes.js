const express = require('express');
const locationController = require('../controllers/locationController');
const router = express.Router();

router.get('/getLocationByMeeting', locationController.getLocationByMeeting);

module.exports = router;