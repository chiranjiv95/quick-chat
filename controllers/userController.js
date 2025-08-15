const User = require("../models/user");
const router = require("express").Router();
const authMiddleware = require("../middlewares/authMiddleware");

// Get details of logged in user
router.get("/get-logged-in-user", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById({ _id: req.user.id });
    res.send({
      message: "User fetched successfully",
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(400).send({
      message: error.message,
      success: false,
    });
    console.log("inside get logged in user catch");
  }
});

// Get all users
router.get("/get-all-users", authMiddleware, async (req, res) => {
  try {
    const users = await User.find({ _id: { $ne: req.user.id } });
    res.send({
      message: "Fetched all users successfully",
      success: true,
      data: users,
    });
  } catch (error) {
    res.status(400).send({ message: error.message, success: false });
  }
});

module.exports = router;
