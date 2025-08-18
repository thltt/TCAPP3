const express = require("express");
const router = express.Router();

const {
  getAwake,
  getStartingBalance,
  postStartingBalance,
  postTransactions,
  getTransactions,
  getCountTransactions,
  deleteTransactions,
  getAllTrips,
  addTrip,
  deleteTrip,
  updateTrip,
} = require("../controllers/homeController");

// API giữ awake
router.get("/health", getAwake);

// API lấy giá trị tồn đầu
router.get("/api/starting-balance", getStartingBalance);

// API cập nhật hoặc xóa tồn đầu
router.post("/api/starting-balance", postStartingBalance);

// API thêm giao dịch
router.post("/api/transactions", postTransactions);

// API lấy giao dịch (có phân trang)
router.get("/api/transactions", getTransactions);

// API đếm tổng số giao dịch (hỗ trợ phân trang client)
router.get("/api/transactions/count", getCountTransactions);

// API xóa giao dịch
router.delete("/api/transactions/:id", deleteTransactions);

// API lấy tất cả phiếu chuyến
router.get("/api/trips", getAllTrips);

// API thêm  phiếu chuyến
router.post("/api/trips", addTrip);

// API cập nhật phiếu chuyến
router.put("/api/trips/:id", updateTrip);

// API xóa phiếu chuyến
router.delete("/api/trips/:id", deleteTrip);

module.exports = router;
