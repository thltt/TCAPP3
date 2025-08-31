// controllers/homeController.js
import * as CRUD from "../services/CRUD.js";

// Khởi tạo thời gian start
const startTime = Date.now();

// ===== Health check =====
export const getAwake = (c) => {
  const uptime = Date.now() - startTime;
  return c.json({
    status: "ok",
    uptime_ms: uptime,
    uptime_seconds: Math.floor(uptime / 1000),
    time: new Date().toISOString(),
  });
};

// ===== Thu Chi =====
export const getStartingBalance = async (c) => c.json(await CRUD.getAmountStartingBalance(c));
export const postStartingBalance = async (c) => {
  const body = await c.req.json();
  return c.json(await CRUD.updateStartingBalance(c, body.starting_balance));
};
export const postTransactions = async (c) => {
  const body = await c.req.json();
  const id = await CRUD.addTransaction(c, body);
  return c.json({ message: "Thêm thành công", id });
};
export const getTransactions = async (c) => {
  const page = parseInt(c.req.query("page") || "1");
  const limit = parseInt(c.req.query("limit") || "50");
  const offset = (page - 1) * limit;
  const rows = await CRUD.getTransactionsList(c, limit, offset);
  return c.json(rows);
};
export const getCountTransactions = async (c) => {
  const total = await CRUD.countTransactions(c);
  return c.json({ total });
};
export const deleteTransactions = async (c) => {
  const id = c.req.param("id");
  const changes = await CRUD.deleteTransaction(c, id);
  if (changes === 0) return c.json({ message: "Không tìm thấy giao dịch để xóa." }, 404);
  return c.json({ message: "Đã xóa thành công." });
};

// ===== Phiếu chuyến =====
export const getAllTrips = async (c) => c.json(await CRUD.getTrips(c));
export const getAllSummaryTrips = async (c) => c.json(await CRUD.getSummaryTrips(c));
export const addTrip = async (c) => {
  const body = await c.req.json();
  const id = await CRUD.insertTrip(c, body);
  return c.json({ message: "Thêm thành công", id });
};
export const deleteTrip = async (c) => {
  const id = c.req.param("id");
  const changes = await CRUD.removeTrip(c, id);
  if (changes === 0) return c.json({ message: "Không tìm thấy phiếu chuyến để xóa." }, 404);
  return c.json({ message: "Xóa thành công" });
};

// ===== Công nợ =====
export const getAllDebts = async (c) => c.json(await CRUD.getDebts(c));
export const getAllSummaryDebts = async (c) => c.json(await CRUD.getSummaryDebts(c));
export const addDebt = async (c) => {
  const body = await c.req.json();
  const id = await CRUD.insertDebt(c, body);
  return c.json({ message: "Thêm thành công", id });
};
export const deleteDebt = async (c) => {
  const id = c.req.param("id");
  const changes = await CRUD.removeDebt(c, id);
  if (changes === 0) return c.json({ message: "Không tìm thấy công nợ để xóa." }, 404);
  return c.json({ message: "Xóa thành công" });
};
