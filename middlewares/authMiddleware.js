const jwt = require("jsonwebtoken");
module.exports = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Authorization header missing or invalid",
        success: false,
      });
    }
    const token = authHeader.split(" ")[1];
    // Decode the token
    const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
    req.user = { id: decodedToken.userId };
    next();
  } catch (error) {
    res.send({
      message: error.message,
      success: false,
    });
    console.log("inside auth middleware catch");
  }
};
