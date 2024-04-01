const Message = require("../models/messageModel");

exports.createMessage = async (req, res) => {
  try {
    const { content, chatId } = req.body;
    var message = await Message.create({
      content,
      chat: chatId,
      sender: req.user.id,
    });
    message = await Message.findById(message._id)
      .populate("sender", "name pic email")
      .populate({
        path: "chat",
        populate: {
          path: "users",
          model: "User",
          select: "name pic email",
        },
      })
      .populate({
        path: "readBy",
        select: "name email pic",
      });
    res.status(200).json({
      success: true,
      message,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.fetchMessages = async (req, res) => {
  try {
    const { chatId } = req.body;
    const messages = await Message.find({ chat: chatId })
      .populate("sender", "name pic email")
      .populate("chat")
      .populate({
        path: "chat",
        populate: {
          path: "users",
          model: "User",
          select: "name pic email",
        },
      })
      .exec();
    res.status(200).json({
      success: true,
      messages,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
