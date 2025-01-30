const express = require('express');
const invitationController = require('../controllers/invitationController');
const router = express.Router();

router.post('/createInvitation', invitationController.createInvitation);

router.get('/getInvitationsByMeetingId/:id_reuniao', invitationController.getInvitationsByMeetingId);

router.get('/getInvitationsByUserId/:id_usuario', invitationController.getInvitationsByUserId);

module.exports = router;