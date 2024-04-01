const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const upload = require("../helper/upload");

dotenv.config();

exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const {image}=req.files
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        success: false,
        message: "user already registered",
      });
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const uploadedImage=await upload(image)
    const newUser = await User.create({ name, email, password: hashPassword ,pic:uploadedImage.secure_url});
    res.status(200).json({
      success: true,
      newUser,
    });
  } catch (error) {
    res.status(4).json({
      success: false,
      message: error.message,
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(email, password);
    const user = await User.findOne({ email });
    console.log(user);
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "user not registered",
      });
    }
    const flag = await bcrypt.compare(password, user.password);
    if (!flag) {
      return res.status(400).json({
        success: false,
        message: "incorrect password",
      });
    }
    const payload = {
      id: user._id,
      name: user.name,
    };
    const token = jwt.sign(payload, process.env.SECRET, {
      expiresIn: "3h",
    });
    res.status(200).json({
      success: true,
      _id: user._id,
      name: user.name,
      email: user.email,
      token: token,
      pic:user.pic||""
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

exports.allUsers = async (req, res) => {
  try {
    const keyword = req.query.search
      ? {
          $or: [
            { name: { $regex: req.query.search, $options: "i" } },
            { email: { $regex: req.query.search, $options: "i" } },
          ],
        }
      : {};
    console.log(keyword)
    const users=await User.find(keyword).find({_id:{$ne:req.user.id}})
    res.status(200).json({
        success: true,
        users
    })
  } catch (error) {
    res.status(200).json({
        success: false,
        message: error.message
    })
  }
};
