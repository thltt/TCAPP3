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

// Controller lấy giá trị tồn đầu
const getStartingBalance = async (req, res) => {
  const result = await getAmountStartingBalance();
  res.json({ starting_balance: result.starting_balance });
};

// Controller cập nhật hoặc xóa tồn đầu
const postStartingBalance = async (req, res) => {
  const { starting_balance } = req.body;
  const result = await updateStartingBalance(starting_balance);
  res.json({ message: "Chỉnh sửa tồn đầu thành công.", result });
};

// Controller thêm giao dịch
const postTransactions = async (req, res) => {
  const id = await addTransaction(req.body);
  res.json({ id });
};

// Controller lấy giao dịch (có phân trang)
const getTransactions = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 50;
  const offset = (page - 1) * limit;
  const rows = await getTransactionsList(limit, offset);
  res.json(rows);
};

// Controller đếm tổng số giao dịch (hỗ trợ phân trang client)
const getCountTransactions = async (req, res) => {
  const total = await countTransactions();
  res.json({ total });
};

// Controller xóa giao dịch
const deleteTransactions = async (req, res) => {
  const id = req.params.id;
  const affected = await deleteTransaction(id);
  if (affected === 0) {
    res.status(404).json({ message: "Không tìm thấy giao dịch để xóa." });
  } else {
    res.json({ message: "Đã xóa thành công." });
  }
};

module.exports = {
  getAwake,
  getStartingBalance,
  postStartingBalance,
  postTransactions,
  getTransactions,
  getCountTransactions,
  deleteTransactions,
};
