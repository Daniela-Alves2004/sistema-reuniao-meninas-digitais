const express = require('express');
const tokenController = require('../controllers/tokenController');
const router = express.Router();

router.post('/validate', tokenController.validate);

module.exports = router;