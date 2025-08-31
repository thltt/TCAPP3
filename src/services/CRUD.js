// services/CRUD.js
// ⚡ Cloudflare D1 version (dùng trong Workers)
// Mọi hàm cần truyền context (c) từ Hono để lấy c.env.DB

// ===== Thu Chi =====

// Lấy giá trị tồn đầu
export const getAmountStartingBalance = async (c) => {
  const { results } = await c.env.DB.prepare("SELECT starting_balance FROM settings WHERE id = 1").all();
  return results[0];
};

// Cập nhật giá trị tồn đầu
export const updateStartingBalance = async (c, starting_balance) => {
  const result = await c.env.DB.prepare("UPDATE settings SET starting_balance = ? WHERE id = 1").bind(starting_balance).run();
  return result;
};

// Thêm giao dịch mới
export const addTransaction = async (c, { date, name, type, amount, category, note }) => {
  const result = await c.env.DB.prepare(
    `INSERT INTO transactions (date, name, type, amount, category, note)
     VALUES (?, ?, ?, ?, ?, ?)`
  )
    .bind(date, name, type, amount, category, note)
    .run();
  return result.lastInsertRowid;
};

// Lấy danh sách giao dịch
export const getTransactionsList = async (c, limit, offset) => {
  const { results } = await c.env.DB.prepare("SELECT * FROM transactions ORDER BY date DESC, id DESC LIMIT ? OFFSET ?")
    .bind(limit, offset)
    .all();
  return results;
};

// Đếm số lượng giao dịch
export const countTransactions = async (c) => {
  const { results } = await c.env.DB.prepare("SELECT COUNT(*) as total FROM transactions").all();
  return results[0].total;
};

// Xóa giao dịch
export const deleteTransaction = async (c, id) => {
  const result = await c.env.DB.prepare("DELETE FROM transactions WHERE id = ?").bind(id).run();
  return result.changes; // số dòng bị ảnh hưởng
};

// ===== Phiếu chuyến =====

// Lấy tất cả phiếu chuyến
export const getTrips = async (c) => {
  const { results } = await c.env.DB.prepare("SELECT * FROM phieuchuyen ORDER BY ngay DESC, id DESC").all();
  return results;
};

// Lấy tổng phiếu chuyến (nợ / đã thanh toán)
export const getSummaryTrips = async (c) => {
  const { results } = await c.env.DB.prepare(
    `
    SELECT
      SUM(CASE WHEN tinh_trang='NỢ' THEN so_tien ELSE 0 END) AS cty_no,
      SUM(CASE WHEN tinh_trang='ĐÃ THANH TOÁN' THEN so_tien ELSE 0 END) AS cty_tra
    FROM phieuchuyen
  `
  ).all();
  return results[0];
};

// Thêm phiếu chuyến
export const insertTrip = async (c, { ngay, so_chuyen, cong_ty, cung_duong, so_khoi, don_gia, so_tien, tinh_trang, ghi_chu }) => {
  const result = await c.env.DB.prepare(
    `INSERT INTO phieuchuyen 
      (ngay, so_chuyen, cong_ty, cung_duong, so_khoi, don_gia, so_tien, tinh_trang, ghi_chu) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
  )
    .bind(ngay, so_chuyen, cong_ty, cung_duong, so_khoi, don_gia, so_tien, tinh_trang, ghi_chu)
    .run();
  return result.lastInsertRowid;
};

// Xóa phiếu chuyến
export const removeTrip = async (c, id) => {
  const result = await c.env.DB.prepare("DELETE FROM phieuchuyen WHERE id = ?").bind(id).run();
  return result.changes;
};

// ===== Công nợ =====

// Lấy tất cả công nợ
export const getDebts = async (c) => {
  const { results } = await c.env.DB.prepare("SELECT * FROM congno ORDER BY ngay DESC, id DESC").all();
  return results;
};

// Lấy tổng công nợ
export const getSummaryDebts = async (c) => {
  const { results } = await c.env.DB.prepare(
    `
    SELECT
      SUM(CASE WHEN loai_gd='NỢ' THEN so_tien ELSE 0 END) AS tong_no,
      SUM(CASE WHEN loai_gd='ĐÃ THANH TOÁN' THEN so_tien ELSE 0 END) AS tong_da_tra
    FROM congno
  `
  ).all();
  return results[0];
};

// Thêm công nợ
export const insertDebt = async (c, { ngay, noi_dung, loai_gd, so_tien, ghi_chu }) => {
  const result = await c.env.DB.prepare(
    `INSERT INTO congno (ngay, noi_dung, loai_gd, so_tien, ghi_chu) 
     VALUES (?, ?, ?, ?, ?)`
  )
    .bind(ngay, noi_dung, loai_gd, so_tien, ghi_chu)
    .run();
  return result.lastInsertRowid;
};

// Xóa công nợ
export const removeDebt = async (c, id) => {
  const result = await c.env.DB.prepare("DELETE FROM congno WHERE id = ?").bind(id).run();
  return result.changes;
};
