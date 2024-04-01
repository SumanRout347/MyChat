
const express=require('express');
const { auth } = require('../middleware/auth');
const { createMessage, fetchMessages } = require('../controller/messageController');

const router=express.Router()

router.post("/message/create",auth,createMessage)
router.post("/message/fetch",auth,fetchMessages)

module.exports = router