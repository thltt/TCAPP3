const pool = require("../config/database");

// Controller giữ awake
const getAwake = (req, res) => {
  res.status(200).json({
    status: "ok",
    uptime: process.uptime(),
    time: new Date(),
  });
};

// Controller lấy giá trị tồn đầu
const getStartingBalance = (req, res) => {
  pool.query("SELECT starting_balance FROM settings WHERE id = 1", (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ starting_balance: rows[0].starting_balance });
  });
};

// Controller cập nhật hoặc xóa tồn đầu
const postStartingBalance = (req, res) => {
  console.log("Body nhận:", req.body);
  const { starting_balance } = req.body;
  const sql = "UPDATE settings SET starting_balance = ? WHERE id = 1";
  pool.query(sql, [starting_balance], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Chỉnh sửa tồn đầu thành công.", result });
  });
};

// Controller thêm giao dịch
const postTransactions = (req, res) => {
  const { date, name, type, amount, category, note } = req.body;
  const sql = `INSERT INTO transactions (date, name, type, amount, category, note) 
               VALUES (?, ?, ?, ?, ?, ?)`;
  pool.query(sql, [date, name, type, amount, category, note], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ id: result.insertId });
  });
};

// Controller lấy giao dịch (có phân trang)
const getTransactions = (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 50;
  const offset = (page - 1) * limit;

  const sql = "SELECT * FROM transactions ORDER BY date DESC, id DESC LIMIT ? OFFSET ?";

  pool.query(sql, [limit, offset], (err, rows) => {
    if (err) return res.status(500).json({ error: err });
    res.json(rows);
  });
};

// Controller đếm tổng số giao dịch (hỗ trợ phân trang client)
const countTransactions = (req, res) => {
  pool.query("SELECT COUNT(*) as total FROM transactions", (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ total: result[0].total });
  });
};

// Controller xóa giao dịch
const deleteTransactions = (req, res) => {
  const id = req.params.id;
  pool.query("DELETE FROM transactions WHERE id = ?", [id], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    if (result.affectedRows === 0) {
      res.status(404).json({ message: "Không tìm thấy giao dịch để xóa." });
    } else {
      res.json({ message: "Đã xóa thành công." });
    }
  });
};

// export
module.exports = {
  getAwake,
  getStartingBalance,
  postStartingBalance,
  postTransactions,
  getTransactions,
  countTransactions,
  deleteTransactions,
};
