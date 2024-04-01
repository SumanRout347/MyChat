const Chat = require("../models/chatModel");


exports.accessChat = async (req, res) => {
  try {
    const { userId } = req.body;
    const chat = await Chat.find({
      isGroupChat: false,
      $and: [
        { users: req.user.id },
        { users: { $elemMatch: { $eq: userId } } },
      ],
    }).populate("users", "-password");
    if (chat.length > 0) {
      res.status(200).json({
        success: true,
        data: chat[0],
      });
    } else {
      const newChat = await Chat.create({
        chatName: "sender",
        users: [req.user.id, userId],
        isGroupChat: false,
      });
      res.status(200).json({
        success: true,
        newChat,
      });
    }
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

exports.fetchChats = async (req, res) => {
  try {
    const chats = await Chat.find({
      users: { $elemMatch: { $eq: req.user.id } },
    })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .sort({ updatedAt: -1 });
    res.status(200).json({
      success: true,
      chats,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
exports.groupChat = async (req, res) => {
  try {
    if (!req.body.chatName || !req.body.users) {
      return res.status(400).json({
        success: false,
        message: "Fields are empty",
      });
    }
    let users = JSON.parse(req.body.users);
    if (users.length < 2) {
      return res.json({
        success: false,
        message: "more than 2 users are required to create a group",
      });
    }
    users.push(req.user.id);
    const groupChat = await Chat.create({
      isGroupChat: true,
      users: users,
      groupAdmin: req.user.id,
      chatName: req.body.chatName,
    });
    res.status(200).json({
      success: true,
      groupChat,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

exports.renameGroup = async (req, res) => {
  try {
    const { chatId, chatName } = req.body;
    const chat = await Chat.findByIdAndUpdate(
      chatId,
      { chatName: chatName },
      { new: true }
    ).populate("users", "name email pic").populate("groupAdmin","_id name email pic").exec()
    res.status(200).json({
      success: true,
      chat,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

exports.removeFromGroup = async (req, res) => {
  try {
    const uId = req.user.id;
    const { chatId } = req.body;
    const chatFound=await Chat.findById(chatId)
    if (!req.body.userId && uId===chatFound.groupAdmin.toString()) {
      await Chat.findByIdAndDelete(
        chatId
      )
      return res.status(200).json({
        success: true,
        message:"Chat deleted successfully"
      });
     
    } 
    else {
      const {userId}=req.body
      const chat = await Chat.findByIdAndUpdate(
        chatId,
        {
          $pull: { users: userId },
        },
        { new: true }
      ).populate("users", "name email pic").populate("groupAdmin","_id name email pic").exec()
      res.status(200).json({
        success: true,
        chat,
      });
    }
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

exports.addToGroup = async (req, res) => {
  try {
    const { chatId, userId } = req.body;
    const chat = await Chat.findByIdAndUpdate(
      chatId,
      { $push: { users: userId } },
      { new: true }
    ).populate("users", "name email pic").populate("groupAdmin", "_id name email pic").exec()
    res.status(200).json({
      success: true,
      chat,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
