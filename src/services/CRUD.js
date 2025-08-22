const pool = require("../config/database");

// ===== Thu Chi =====

// lấy giá trị tồn đầu Thu Chi
const getAmountStartingBalance = async () => {
  const [rows] = await pool.query("SELECT starting_balance FROM settings WHERE id = 1");
  return rows[0];
};

// cập nhật giá trị tồn đầu Thu Chi
const updateStartingBalance = async (starting_balance) => {
  const [result] = await pool.query("UPDATE settings SET starting_balance = ? WHERE id = 1", [starting_balance]);
  return result;
};

// thêm giao dịch mới Thu Chi
const addTransaction = async ({ date, name, type, amount, category, note }) => {
  const [result] = await pool.query(
    `INSERT INTO transactions (date, name, type, amount, category, note) 
     VALUES (?, ?, ?, ?, ?, ?)`,
    [date, name, type, amount, category, note]
  );
  return result.insertId;
};

// lấy danh sách giao dịch Thu Chi
const getTransactionsList = async (limit, offset) => {
  const [rows] = await pool.query("SELECT * FROM transactions ORDER BY date DESC, id DESC LIMIT ? OFFSET ?", [limit, offset]);
  return rows;
};

// đếm số lượng giao dịch Thu Chi
const countTransactions = async () => {
  const [rows] = await pool.query("SELECT COUNT(*) as total FROM transactions");
  return rows[0].total;
};

// xóa giao dịch Thu Chi
const deleteTransaction = async (id) => {
  const [result] = await pool.query("DELETE FROM transactions WHERE id = ?", [id]);
  return result.affectedRows;
};

// === Phiếu chuyến ====

// lấy chuyến
const getTrips = async () => {
  const [rows] = await pool.query("SELECT * FROM phieuchuyen ORDER BY ngay DESC, id DESC");
  return rows;
};

// lấy tổng phiếu chuyến đã trả/chưa trả
const getSummaryTrips = async () => {
  const [summary] = await pool.query(`SELECT
	SUM(CASE WHEN tinh_trang='NỢ' THEN so_tien ELSE 0 END) AS cty_no,
	SUM(CASE WHEN tinh_trang='ĐÃ THANH TOÁN' THEN so_tien ELSE 0 END) AS cty_tra
  FROM phieuchuyen`);
  return summary;
};

// thêm phiếu chuyến
const insertTrip = async ({ ngay, so_chuyen, cong_ty, cung_duong, so_khoi, don_gia, so_tien, tinh_trang, ghi_chu }) => {
  const sql = `INSERT INTO phieuchuyen 
    (ngay, so_chuyen, cong_ty, cung_duong, so_khoi, don_gia, so_tien, tinh_trang, ghi_chu) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  const [result] = await pool.query(sql, [ngay, so_chuyen, cong_ty, cung_duong, so_khoi, don_gia, so_tien, tinh_trang, ghi_chu]);
  return result.insertId;
};

// xóa phiếu chuyến
const removeTrip = async (id) => {
  const [result] = await pool.query("DELETE FROM phieuchuyen WHERE id = ?", [id]);
  return result.affectedRows;
};

// === Công Nợ ====

// lấy tất cả công nợ
const getDebts = async () => {
  const [rows] = await pool.query("SELECT * FROM congno ORDER BY ngay DESC, id DESC");
  return rows;
};

// lấy tổng công nợ chưa trả/đã trả
const getSummaryDebts = async () => {
  const [summary] = await pool.query(`SELECT
  SUM(CASE WHEN loai_gd='NỢ' THEN so_tien ELSE 0 END) AS tong_no,
  SUM(CASE WHEN loai_gd='ĐÃ THANH TOÁN' THEN so_tien ELSE 0 END) AS tong_da_tra
  FROM congno`);
  return summary;
};

// thêm công nợ
const insertDebt = async ({ ngay, noi_dung, loai_gd, so_tien, ghi_chu }) => {
  const [result] = await pool.query(
    `INSERT INTO congno (ngay, noi_dung, loai_gd, so_tien, ghi_chu) 
     VALUES (?, ?, ?, ?, ?)`,
    [ngay, noi_dung, loai_gd, so_tien, ghi_chu]
  );
  return result.insertId;
};

// xóa công nợ
const removeDebt = async (id) => {
  const [result] = await pool.query("DELETE FROM congno WHERE id = ?", [id]);
  return result.affectedRows;
};

module.exports = {
  // Thu Chi
  getAmountStartingBalance,
  updateStartingBalance,
  addTransaction,
  getTransactionsList,
  countTransactions,
  deleteTransaction,
  // Phiếu Chuyến
  getTrips,
  insertTrip,
  removeTrip,
  // Công nợ
  getDebts,
  insertDebt,
  removeDebt,
  // Gửi tổng
  getSummaryDebts,
  getSummaryTrips,
};
