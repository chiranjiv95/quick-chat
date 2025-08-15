const router = require("express").Router();
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

router.post("/signup", async (req, res) => {
  try {
    // 1. Check if the user already exists
    const user = await User.findOne({ email: req.body.email });

    // 2. If user exists, send an error response
    if (user) {
      return res
        .status(400)
        .send({ message: "User already exists", success: false });
    }

    // 3. Encrypt the password
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    req.body.password = hashedPassword;

    // 4. Create new user and save in db
    const newUser = new User(req.body);
    await newUser.save();

    res
      .status(201)
      .send({ message: "User created successfully", success: true });
  } catch (error) {
    res.send({ message: error.message, success: false });
  }
});

router.post("/login", async (req, res) => {
  try {
    // 1. Check if user exists
    const user = await User.findOne({ email: req.body.email });

    if (!user)
      return res.send({ message: "User does not exists", success: false });

    // 2. Match password
    const isValid = await bcrypt.compare(req.body.password, user.password);
    if (!isValid)
      return res
        .status(400)
        .send({ message: "Invalid credentials", success: false });

    // 3. Assign a JWT
    const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });

    res.send({
      message: "User logged in successfully",
      success: true,
      token: token,
    });
  } catch (error) {
    res.send({ message: error.message, success: false });
  }
});

module.exports = router;
