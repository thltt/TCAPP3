const pool = require("../config/database");

const {
  getAmountStartingBalance,
  updateStartingBalance,
  addTransaction,
  getTransactionsList,
  countTransactions,
  deleteTransaction,
  getTrips,
} = require("../services/CRUD");

// Controller giữ awake
const getAwake = (req, res) => {
  res.status(200).json({ status: "ok", uptime: process.uptime(), time: new Date() });
};

// ===== Thu Chi =====

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

// ===== Phiếu chuyến =====

// Lấy tất cả phiếu chuyến
const getAllTrips = async (req, res) => {
  const rows = await getTrips();
  res.json(rows);
};

const addTrip = async (req, res) => {
  await insertTrip(req.body);
  res.json({ message: "Thêm thành công" });
};

const deleteTrip = async (req, res) => {
  const { id } = req.params;
  await removeTrip(id);
  res.json({ message: "Xóa thành công" });
};

const updateTrip = async (req, res) => {
  const { id } = req.params;
  await updateTripById(id, req.body);
  res.json({ message: "Cập nhật thành công" });
};

module.exports = {
  getAwake,
  // Thu Chi
  getStartingBalance,
  postStartingBalance,
  postTransactions,
  getTransactions,
  getCountTransactions,
  deleteTransactions,
  // Phiếu Chuyến
  getAllTrips,
  addTrip,
  deleteTrip,
  updateTrip,
};
