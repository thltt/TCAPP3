const pool = require("../config/database");

const {
  getAmountStartingBalance,
  updateStartingBalance,
  addTransaction,
  getTransactionsList,
  countTransactions,
  deleteTransaction,
} = require("../services/CRUD");

// Controller giữ awake
const getAwake = (req, res) => {
  res.status(200).json({ status: "ok", uptime: process.uptime(), time: new Date() });
};

// Controller lấy giá trị tồn đầu Thu Chi
const getStartingBalance = async (req, res) => {
  const result = await getAmountStartingBalance();
  res.json({ starting_balance: result.starting_balance });
};

// Controller cập nhật hoặc xóa tồn đầu Thu Chi
const postStartingBalance = async (req, res) => {
  const { starting_balance } = req.body;
  const result = await updateStartingBalance(starting_balance);
  res.json({ message: "Chỉnh sửa tồn đầu thành công.", result });
};

// Controller thêm giao dịch Thu Chi
const postTransactions = async (req, res) => {
  const id = await addTransaction(req.body);
  res.json({ id });
};

// Controller lấy giao dịch (có phân trang) Thu Chi
const getTransactions = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 50;
  const offset = (page - 1) * limit;
  const rows = await getTransactionsList(limit, offset);
  res.json(rows);
};

// Controller đếm tổng số giao dịch (hỗ trợ phân trang client) Thu Chi
const getCountTransactions = async (req, res) => {
  const total = await countTransactions();
  res.json({ total });
};

// Controller xóa giao dịch Thu Chi
const deleteTransactions = async (req, res) => {
  const id = req.params.id;
  const affected = await deleteTransaction(id);
  if (affected === 0) {
    res.status(404).json({ message: "Không tìm thấy giao dịch để xóa." });
  } else {
    res.json({ message: "Đã xóa thành công." });
  }
};

// Lấy tất cả phiếu chuyến
const getAllTrips = async (req, res, next) => {
  const [rows] = await pool.query("SELECT * FROM phieuchuyen ORDER BY ngay DESC");
  res.json(rows);
};

// Thêm phiếu chuyến
const addTrip = async (req, res, next) => {
  const { ngay, so_chuyen, cong_ty, cung_duong, so_khoi, don_gia, so_tien, tinh_trang, ghi_chu } = req.body;

  const sql = `INSERT INTO phieuchuyen 
    (ngay, so_chuyen, cong_ty, cung_duong, so_khoi, don_gia, so_tien, tinh_trang, ghi_chu) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  await pool.query(sql, [ngay, so_chuyen, cong_ty, cung_duong, so_khoi, don_gia, so_tien, tinh_trang, ghi_chu]);
  res.json({ message: "Thêm thành công" });
};

// Xoá phiếu chuyến
const deleteTrip = async (req, res, next) => {
  const { id } = req.params;
  await pool.query("DELETE FROM phieuchuyen WHERE id = ?", [id]);
  res.json({ message: "Xoá thành công" });
};

// Cập nhật phiếu chuyến
const updateTrip = async (req, res, next) => {
  const { id } = req.params;
  const { ngay, so_chuyen, cong_ty, cung_duong, so_khoi, don_gia, so_tien, tinh_trang, ghi_chu } = req.body;

  const sql = `UPDATE phieuchuyen SET 
    ngay=?, so_chuyen=?, cong_ty=?, cung_duong=?, so_khoi=?, don_gia=?, so_tien=?, tinh_trang=?, ghi_chu=? 
    WHERE id=?`;

  await pool.query(sql, [ngay, so_chuyen, cong_ty, cung_duong, so_khoi, don_gia, so_tien, tinh_trang, ghi_chu, id]);
  res.json({ message: "Cập nhật thành công" });
};

module.exports = {
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
};
