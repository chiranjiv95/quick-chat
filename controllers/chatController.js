const router = require("express").Router();
const Chat = require("../models/chat");
const authMiddleware = require("../middlewares/authMiddleware");

router.post("/create-chat", authMiddleware, async (req, res) => {
  try {
    const chat = new Chat(req.body);
    const savedChat = await chat.save();

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
    const chats = await Chat.find({ members: req.user.id });

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

module.exports = router;
