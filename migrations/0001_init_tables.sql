-- Migration number: 0001 	 2025-09-01T02:46:36.563Z
-- settings: lưu tồn đầu
CREATE TABLE IF NOT EXISTS settings (
  id INTEGER PRIMARY KEY,
  starting_balance REAL
);

INSERT OR IGNORE INTO settings (id, starting_balance) VALUES (1, 0);

-- transactions: lưu giao dịch Thu Chi
CREATE TABLE IF NOT EXISTS transactions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  date TEXT NOT NULL,
  name TEXT,
  type TEXT,
  amount REAL,
  category TEXT,
  note TEXT
);

-- phieuchuyen: lưu phiếu chuyến
CREATE TABLE IF NOT EXISTS phieuchuyen (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ngay TEXT NOT NULL,
  so_chuyen TEXT,
  cong_ty TEXT,
  cung_duong TEXT,
  so_khoi REAL,
  don_gia REAL,
  so_tien REAL,
  tinh_trang TEXT,
  ghi_chu TEXT
);

-- congno: lưu công nợ
CREATE TABLE IF NOT EXISTS congno (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ngay TEXT NOT NULL,
  noi_dung TEXT,
  loai_gd TEXT,
  so_tien REAL,
  ghi_chu TEXT
);
