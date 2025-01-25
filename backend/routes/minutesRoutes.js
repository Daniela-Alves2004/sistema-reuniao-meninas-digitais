const express = require('express');
const minutesController = require('../controllers/minutesController');
const router = express.Router();

router.post('/createMinutes', minutesController.createMinutes);

module.exports = router;