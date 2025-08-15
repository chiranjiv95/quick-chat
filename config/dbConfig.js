const mongoose = require("mongoose");

// Connection logic
mongoose.connect(process.env.CONN_STRING);

// Connection state
const db = mongoose.connection;

// Check DB Connection
db.on("connected", () => console.log("DB Connected Successfully"));
db.on("err", () => console.log("DB Connection failed"));

module.exports = db;
