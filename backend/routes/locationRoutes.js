const express = require('express');
const locationController = require('../controllers/locationController');
const router = express.Router();

router.get('/getLocationByMeeting', locationController.getLocationByMeeting);

router.get('/getAllLocations', locationController.getAllLocations);

router.post('/createLocation', locationController.createLocation);

module.exports = router;