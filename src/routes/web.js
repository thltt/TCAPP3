// routes/web.js
import { Hono } from "hono";
import {
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
  // Công nợ
  getAllDebts,
  addDebt,
  deleteDebt,
  // Lấy tổng
  getAllSummaryDebts,
  getAllSummaryTrips,
} from "../controllers/homeController.js";

const web = new Hono();

// ===== Health check =====
web.get("/health", getAwake);
web.get("/", (c) => {
  return c.html(`
    <html>
      <head>
        <title>Thu Chi App</title>
      </head>
      <body>
        <h1>Welcome to Thu Chi App!</h1>
        <p>Server is running on Cloudflare Workers.</p>
      </body>
    </html>
  `);
});

// ===== Thu Chi =====
web.get("/api/starting-balance", getStartingBalance);
web.post("/api/starting-balance", postStartingBalance);

web.post("/api/transactions", postTransactions);
web.get("/api/transactions", getTransactions);
web.get("/api/transactions/count", getCountTransactions);
web.delete("/api/transactions/:id", deleteTransactions);

// ===== Phiếu Chuyến =====
web.get("/api/trips", getAllTrips);
web.get("/api/trips/summary", getAllSummaryTrips);
web.post("/api/trips", addTrip);
web.delete("/api/trips/:id", deleteTrip);

// ===== Công Nợ =====
web.get("/api/debts", getAllDebts);
web.get("/api/debts/summary", getAllSummaryDebts);
web.post("/api/debts", addDebt);
web.delete("/api/debts/:id", deleteDebt);

export default web;
