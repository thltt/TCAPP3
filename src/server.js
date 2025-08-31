const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const app = express();
const port = process.env.PORT || 8040;

app.use(cors());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

const webRouter = require("./routes/web");
app.use("/", webRouter); //goi route

// Middleware xử lý lỗi tập trung
app.use((err, req, res, next) => {
  console.error("❌ Lỗi:", err);
  res.status(500).json({ error: err.message });
});

// Khởi động server
app.listen(port, "0.0.0.0", () => {
  console.log(`🚀 Server đang chạy trên cổng ${port}`);
});
