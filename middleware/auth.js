
const jwt = require("jsonwebtoken")
const User = require("../models/userModel")

const dotenv = require("dotenv")

dotenv.config()
exports.auth=async(req,res,next)=>{
    try {
        const token=req.headers.authorization.split(" ")[1]
        const decodedToken=jwt.verify(token,process.env.SECRET) 
        if(!decodedToken){
            res.status(400).json({
                success: false,
                messaage: "invalid token"
            })  
        }
        req.user=await User.findById(decodedToken.id).select("-password")
        next()

    } catch (error) {
        res.status(400).json({
            success: false,
            messaage: error.message
        })
    }
}
