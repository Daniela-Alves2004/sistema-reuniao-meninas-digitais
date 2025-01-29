const express = require('express');
const invitationController = require('../controllers/invitationController');
const router = express.Router();

router.post('/createInvitation', invitationController.createInvitation);

module.exports = router;