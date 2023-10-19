const express = require('express');

const chatController = require('../controller/chat')
const auth=require('../middleware/auth')

const router = express.Router();

// router.get('/chat', chatController.chatPage);
router.get('/chat', chatController.chatPage);
router.post('/chat',auth,chatController.postChat);

// router.get('/chat/groups',auth.auth,chatController.getGroups);

module.exports = router;