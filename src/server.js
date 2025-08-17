const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const app = express();
const port = process.env.PORT || 8050;

app.use(cors());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

const pool = require("./config/database");
const webRouter = require("./routes/web");
app.use("/", webRouter); //goi route

// Khởi động server
app.listen(port, () => {
  console.log(`🚀 Server đang chạy tại http://localhost:${port}`);
});
