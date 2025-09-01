const API_SUM_DEBTS = "https://mytcapp3.nhuhuynhnho254.workers.dev/api/debts/summary";
const API_SUM_TRIPS = "https://mytcapp3.nhuhuynhnho254.workers.dev/api/trips/summary";

let tripsSummary = null;
let debtsSummary = null;

// helper: ép số + format
const toNumber = (v) => {
  const num = Number(typeof v === "string" ? v.replace(/[^\d.-]/g, "") : v);
  return Number.isFinite(num) ? num : 0;
};
const fmtVND = (v) => toNumber(v).toLocaleString("vi-VN") + " VNĐ";

function updateDiffer() {
  if (tripsSummary && debtsSummary) {
    const differ = toNumber(tripsSummary.cty_no) - toNumber(debtsSummary.tong_no);
    document.getElementById("total_differ").textContent = fmtVND(differ);
  }
}

async function fetchSummaryTrips() {
  try {
    const res = await fetch(API_SUM_TRIPS, { cache: "no-store" });
    if (!res.ok) throw new Error(`Trips fetch failed: ${res.status}`);

    const raw = await res.json();
    console.log("Trips data:", raw);

    tripsSummary = Array.isArray(raw) ? raw[0] : raw;
    if (!tripsSummary) return;

    document.getElementById("company_not_pay").textContent = fmtVND(tripsSummary.cty_no);
    document.getElementById("company_payed").textContent = fmtVND(tripsSummary.cty_tra);
    document.getElementById("phieuchuyen_remain").textContent = fmtVND(
      toNumber(tripsSummary.cty_no) - toNumber(tripsSummary.cty_tra)
    );

    updateDiffer();
  } catch (err) {
    console.error("Trips error:", err);
  }
}

async function fetchSummaryDebts() {
  try {
    const res = await fetch(API_SUM_DEBTS, { cache: "no-store" });
    if (!res.ok) throw new Error(`Debts fetch failed: ${res.status}`);

    const raw = await res.json();
    console.log("Debts data:", raw);

    debtsSummary = Array.isArray(raw) ? raw[0] : raw;
    if (!debtsSummary) return;

    document.getElementById("debt_must_pay").textContent = fmtVND(debtsSummary.tong_no);
    document.getElementById("debt_payed").textContent = fmtVND(debtsSummary.tong_da_tra);
    document.getElementById("congno_remain").textContent = fmtVND(
      toNumber(debtsSummary.tong_no) - toNumber(debtsSummary.tong_da_tra)
    );

    updateDiffer();
  } catch (err) {
    console.error("Debts error:", err);
  }
}

function refreshData() {
  fetchSummaryTrips();
  fetchSummaryDebts();
}

document.addEventListener("DOMContentLoaded", () => {
  refreshData();
  setInterval(refreshData, 600000);
});
