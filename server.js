const dotenv = require("dotenv");
dotenv.config({
  path: "./config.env",
});
const dbConfig = require("./config/dbConfig");

const app = require("./app");

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port ${port}...`));
