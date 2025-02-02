const express = require('express');
const sectorController = require('../controllers/sectorController');
const router = express.Router();

router.post('/createSector', sectorController.createSector);

module.exports = router;