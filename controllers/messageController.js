const router = require("express").Router();
const Message = require("../models/message");
const authMiddleware = require("../middlewares/authMiddleware");
const Chat = require("../models/chat");

router.post("/new-message", authMiddleware, async (req, res) => {
  try {
    // 1. store the message in collection
    const message = new Message(req.body);
    const savedMessage = await message.save();

    // 2. update the last message in chat collection
    // const currentChat = await Chat.findById(req.body.chatId);
    // currentChat.lastMessage = savedMessage._id;
    // await currentChat.save();

    await Chat.findOneAndUpdate(
      {
        _id: req.body.chatId,
      },
      {
        lastMessage: savedMessage._id,
        $inc: { unreadMessageCount: 1 },
      }
    );

    res.status(201).send({
      message: "message sent successfully",
      success: true,
      data: savedMessage,
    });
  } catch (error) {
    res.status(400).send({
      message: error.message,
      success: false,
    });
  }
});

router.get("/get-all-messages/:chatId", authMiddleware, async (req, res) => {
  try {
    const messages = await Message.find({ chatId: req.params.chatId });
    res.status(200).send({
      message: "messages fetched successfully",
      success: true,
      data: messages,
    });
  } catch (error) {
    res.status(400).send({
      message: error.message,
      success: false,
    });
  }
});

module.exports = router;
