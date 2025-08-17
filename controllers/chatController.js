const router = require("express").Router();
const Chat = require("../models/chat");
const Message = require("../models/message");

const authMiddleware = require("../middlewares/authMiddleware");

router.post("/create-chat", authMiddleware, async (req, res) => {
  try {
    const chat = new Chat(req.body);
    let savedChat = await chat.save();

    // Populate members after saving
    savedChat = await savedChat.populate("members");

    res.status(201).send({
      message: "Chat created successfully",
      success: true,
      data: savedChat,
    });
  } catch (error) {
    res.status(400).send({ message: error.message, success: false });
  }
});

router.get("/get-user-chats", authMiddleware, async (req, res) => {
  try {
    const chats = await Chat.find({ members: req.user.id })
      .populate("members")
      .populate("lastMessage")
      .sort({ updatedAt: -1 });

    if (!chats)
      return res
        .status(404)
        .send({ message: "No chats found", success: false });

    res.status(200).send({
      message: "Chats fetched successfully",
      success: true,
      data: chats,
    });
  } catch (error) {
    res.status(400).send({ message: error.message, success: false });
  }
});

router.post("/clear-unread-message", authMiddleware, async (req, res) => {
  try {
    const chatId = req.body.chatId;
    console.log("chatId received:", chatId);

    // Update unread msg count in chat collection
    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      { unreadMessageCount: 0 },
      { new: true }
    )
      .populate("members")
      .populate("lastMessage");

    // Update the read property to true in message collection
    await Message.updateMany(
      {
        chatId: chatId,
        read: false,
      },
      {
        read: true,
      }
    );

    res.status(201).send({
      message: "Unread message count cleared successfully",
      success: true,
      data: updatedChat,
    });
  } catch (error) {
    res.status(400).send({ message: error.message, success: false });
  }
});

module.exports = router;
