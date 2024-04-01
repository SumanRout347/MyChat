const express=require('express');
const { auth } = require('../middleware/auth');
const { accessChat, fetchChats, groupChat, renameGroup, removeFromGroup, addToGroup } = require('../controller/chatController');



const router=express.Router()

router.post("/access",auth,accessChat)
router.get("/chat",auth,fetchChats)
router.post("/chat/group",auth,groupChat)
router.post("/chat/rename",auth,renameGroup)
router.post("/chat/remove",auth,removeFromGroup)
router.post("/chat/add",auth,addToGroup)

module.exports =router
