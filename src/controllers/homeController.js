// controllers/homeController.js
import {
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
  // lấy tổng
  getSummaryDebts,
  getSummaryTrips,
} from "../services/CRUD.js";

// Controller giữ awake
export const getAwake = (c) => {
  return c.json({
    status: "ok",
    uptime: process.uptime(),
    time: new Date(),
  });
};

// ===== Thu Chi =====

// Lấy giá trị tồn đầu Thu Chi
export const getStartingBalance = async (c) => {
  const result = await getAmountStartingBalance();
  return c.json({ starting_balance: result.starting_balance });
};

// Cập nhật hoặc xóa tồn đầu Thu Chi
export const postStartingBalance = async (c) => {
  const body = await c.req.json();
  const result = await updateStartingBalance(body.starting_balance);
  return c.json({ message: "Chỉnh sửa tồn đầu thành công.", result });
};

// Thêm giao dịch
export const postTransactions = async (c) => {
  const body = await c.req.json();
  const id = await addTransaction(body);
  return c.json({ message: "Thêm thành công", id });
};

// Lấy danh sách giao dịch (phân trang)
export const getTransactions = async (c) => {
  const page = parseInt(c.req.query("page") || "1");
  const limit = parseInt(c.req.query("limit") || "50");
  const offset = (page - 1) * limit;
  const rows = await getTransactionsList(limit, offset);
  return c.json(rows);
};

// Đếm tổng số giao dịch
export const getCountTransactions = async (c) => {
  const total = await countTransactions();
  return c.json({ total });
};

// Xóa giao dịch
export const deleteTransactions = async (c) => {
  const id = c.req.param("id");
  const affected = await deleteTransaction(id);
  if (affected === 0) {
    return c.json({ message: "Không tìm thấy giao dịch để xóa." }, 404);
  }
  return c.json({ message: "Đã xóa thành công." });
};

// ===== Phiếu chuyến =====

// Lấy tất cả phiếu chuyến
export const getAllTrips = async (c) => {
  const rows = await getTrips();
  return c.json(rows);
};

// Lấy tổng phiếu chuyến
export const getAllSummaryTrips = async (c) => {
  const summary = await getSummaryTrips();
  return c.json(summary);
};

// Thêm phiếu chuyến
export const addTrip = async (c) => {
  const body = await c.req.json();
  const id = await insertTrip(body);
  return c.json({ message: "Thêm thành công", id });
};

// Xóa phiếu chuyến
export const deleteTrip = async (c) => {
  const id = c.req.param("id");
  const affected = await removeTrip(id);
  if (affected === 0) {
    return c.json({ message: "Không tìm thấy phiếu chuyến để xóa." }, 404);
  }
  return c.json({ message: "Xóa thành công" });
};

// ===== Công nợ =====

// Lấy tất cả công nợ
export const getAllDebts = async (c) => {
  const rows = await getDebts();
  return c.json(rows);
};

// Lấy tổng công nợ
export const getAllSummaryDebts = async (c) => {
  const summary = await getSummaryDebts();
  return c.json(summary);
};

// Thêm công nợ
export const addDebt = async (c) => {
  const body = await c.req.json();
  const id = await insertDebt(body);
  return c.json({ message: "Thêm thành công", id });
};

// Xóa công nợ
export const deleteDebt = async (c) => {
  const id = c.req.param("id");
  const affected = await removeDebt(id);
  if (affected === 0) {
    return c.json({ message: "Không tìm thấy công nợ để xóa." }, 404);
  }
  return c.json({ message: "Xóa thành công" });
};
