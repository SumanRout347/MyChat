

const express=require('express');
const { signup, login, allUsers} = require('../controller/userController');
const { auth} = require('../middleware/auth');

const router=express.Router()
router.post("/signup",signup)
router.post("/login",login)
router.get("/auth/users",auth,allUsers)


module.exports =router