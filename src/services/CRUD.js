const pool = require("../config/database");

// lấy giá trị tồn đầu
const getAmountStartingBalance = async () => {
  const [rows] = await pool.query("SELECT starting_balance FROM settings WHERE id = 1");
  return rows[0];
};

// cập nhật giá trị tồn đầu
const updateStartingBalance = async (starting_balance) => {
  const [result] = await pool.query("UPDATE settings SET starting_balance = ? WHERE id = 1", [starting_balance]);
  return result;
};

// thêm giao dịch mới
const addTransaction = async ({ date, name, type, amount, category, note }) => {
  const [result] = await pool.query(
    `INSERT INTO transactions (date, name, type, amount, category, note) 
     VALUES (?, ?, ?, ?, ?, ?)`,
    [date, name, type, amount, category, note]
  );
  return result.insertId;
};

// lấy danh sách giao dịch
const getTransactionsList = async (limit, offset) => {
  const [rows] = await pool.query("SELECT * FROM transactions ORDER BY date DESC, id DESC LIMIT ? OFFSET ?", [limit, offset]);
  return rows;
};

// đếm số lượng giao dịch
const countTransactions = async () => {
  const [rows] = await pool.query("SELECT COUNT(*) as total FROM transactions");
  return rows[0].total;
};

// xóa giao dịch
const deleteTransaction = async (id) => {
  const [result] = await pool.query("DELETE FROM transactions WHERE id = ?", [id]);
  return result.affectedRows;
};

module.exports = {
  getAmountStartingBalance,
  updateStartingBalance,
  addTransaction,
  getTransactionsList,
  countTransactions,
  deleteTransaction,
};
