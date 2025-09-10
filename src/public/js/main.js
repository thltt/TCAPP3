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

// Xuất excel Gộp
function exportExcel() {
  const toDay = new Date();
  const toDayString = toDay.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  const table = document.getElementById("totalTable");
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.table_to_sheet(table, { raw: true });

  Object.keys(ws).forEach((cell) => {
    if (cell[0] === "!") return;
    let raw = ws[cell].v || "";
    if (typeof raw === "string") {
      const cleaned = raw.replace(/\./g, "").replace(/\s*VNĐ/g, "");
      const numberValue = Number(cleaned);
      if (!isNaN(numberValue)) {
        ws[cell].v = numberValue;
        ws[cell].t = "n";
      }
    }
  });

  XLSX.utils.book_append_sheet(wb, ws, "BCTQ");
  XLSX.writeFile(wb, `BCTQ_${toDayString}.xlsx`);
}

// Thay thế toàn bộ exportAllExcel hiện có bằng hàm này
async function exportAllExcel() {
  const toDay = new Date();
  const toDayString = toDay.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  // Sử dụng các constant nếu đã khai báo, nếu chưa thì fallback
  const debtsUrl = typeof API_DEBTS !== "undefined" ? API_DEBTS : "https://mytcapp3.nhuhuynhnho254.workers.dev/api/debts";
  const tripsUrl = typeof API_TRIPS !== "undefined" ? API_TRIPS : "https://mytcapp3.nhuhuynhnho254.workers.dev/api/trips";
  const transactionsUrl =
    typeof API_TRANSACTIONS !== "undefined" ? API_TRANSACTIONS : "https://mytcapp3.nhuhuynhnho254.workers.dev/api/transactions";
  const startBalUrl = "https://mytcapp3.nhuhuynhnho254.workers.dev/api/starting-balance";
  const sumDebtsUrl =
    typeof API_SUM_DEBTS !== "undefined" ? API_SUM_DEBTS : "https://mytcapp3.nhuhuynhnho254.workers.dev/api/debts/summary";
  const sumTripsUrl =
    typeof API_SUM_TRIPS !== "undefined" ? API_SUM_TRIPS : "https://mytcapp3.nhuhuynhnho254.workers.dev/api/trips/summary";

  // helpers (dùng toNumber nếu đã có, nếu không dùng nội bộ)
  const _toNumber =
    typeof toNumber === "function"
      ? toNumber
      : (v) => {
          const num = Number(String(v).replace(/[^\d.-]/g, ""));
          return Number.isFinite(num) ? num : 0;
        };

  const _fmtDate = (iso) => {
    if (!iso) return "";
    // nếu iso có dạng full datetime hoặc yyyy-mm-dd
    try {
      const s = String(iso).slice(0, 10).split("-");
      if (s.length === 3) return `${parseInt(s[2])}-${parseInt(s[1])}-${s[0]}`;
      const d = new Date(iso);
      if (!isNaN(d)) return `${d.getDate()}-${d.getMonth() + 1}-${d.getFullYear()}`;
    } catch (e) {}
    return String(iso);
  };

  const wb = XLSX.utils.book_new();

  try {
    // fetch tất cả (nếu một endpoint lỗi, ta vẫn cố gắng tiếp tục với phần còn lại)
    const [debtsRes, tripsRes, transactionsRes, startBalRes, sumDebtsRes, sumTripsRes] = await Promise.allSettled([
      fetch(debtsUrl, { cache: "no-store" }),
      fetch(tripsUrl, { cache: "no-store" }),
      fetch(transactionsUrl, { cache: "no-store" }),
      fetch(startBalUrl, { cache: "no-store" }),
      fetch(sumDebtsUrl, { cache: "no-store" }),
      fetch(sumTripsUrl, { cache: "no-store" }),
    ]);

    // --- 4) BCTQ (tổng hợp) lấy từ API summary nếu có
    let sumDebts = null;
    let sumTrips = null;
    if (sumDebtsRes.status === "fulfilled" && sumDebtsRes.value.ok) {
      try {
        const raw = await sumDebtsRes.value.json();
        sumDebts = Array.isArray(raw) ? raw[0] : raw;
      } catch (e) {
        sumDebts = null;
      }
    }
    if (sumTripsRes.status === "fulfilled" && sumTripsRes.value.ok) {
      try {
        const raw = await sumTripsRes.value.json();
        sumTrips = Array.isArray(raw) ? raw[0] : raw;
      } catch (e) {
        sumTrips = null;
      }
    }

    // build an array of [label, value] rows
    const bctqRows = [];
    if (sumTrips) {
      bctqRows.push(["TỔNG CÔNG TY CHƯA THANH TOÁN", _toNumber(sumTrips.cty_no)]);
      bctqRows.push(["TỔNG CÔNG TY ĐÃ THANH TOÁN", _toNumber(sumTrips.cty_tra)]);
      bctqRows.push(["CÔNG TY NỢ CÒN LẠI", _toNumber(sumTrips.cty_no) - _toNumber(sumTrips.cty_tra)]);
    }
    if (sumDebts) {
      bctqRows.push(["TỔNG NỢ PHẢI TRẢ", _toNumber(sumDebts.tong_no)]);
      bctqRows.push(["TỔNG NỢ ĐÃ TRẢ", _toNumber(sumDebts.tong_da_tra)]);
      bctqRows.push(["NỢ CÒN LẠI", _toNumber(sumDebts.tong_no) - _toNumber(sumDebts.tong_da_tra)]);
    }
    // differ nếu có
    if (sumTrips && sumDebts) {
      bctqRows.push(["CHÊNH LỆCH", _toNumber(sumTrips.cty_no) - _toNumber(sumDebts.tong_no)]);
    }

    if (bctqRows.length) {
      // thêm tiêu đề cột
      const wsBCTQ = XLSX.utils.aoa_to_sheet([["BÁO CÁO TỔNG QUAN"], ...bctqRows]);
      XLSX.utils.book_append_sheet(wb, wsBCTQ, "BCTQ");
    } else {
      const wsEmpty = XLSX.utils.aoa_to_sheet([["Không có dữ liệu tổng hợp (BCTQ)"]]);
      XLSX.utils.book_append_sheet(wb, wsEmpty, "BCTQ");
    }

    // --- 2) Phiếu Chuyển (trips)
    if (tripsRes.status === "fulfilled" && tripsRes.value.ok) {
      const trips = await tripsRes.value.json();
      const tripsRows = (Array.isArray(trips) ? trips : []).map((t) => ({
        Ngày: _fmtDate(t.ngay),
        "Số chuyến": Number(t.so_chuyen) || 0,
        "Công ty": t.cong_ty || "",
        "Cung đường": t.cung_duong || "",
        "Số khối": _toNumber(t.so_khoi),
        "Đơn giá": _toNumber(t.don_gia),
        "Số tiền": _toNumber(t.so_tien),
        "Tình trạng": t.tinh_trang || "",
        "Ghi chú": t.ghi_chu || "",
      }));
      if (tripsRows.length) {
        const wsTrips = XLSX.utils.json_to_sheet(tripsRows, {
          header: ["Ngày", "Số chuyến", "Công ty", "Cung đường", "Số khối", "Đơn giá", "Số tiền", "Tình trạng", "Ghi chú"],
        });
        XLSX.utils.book_append_sheet(wb, wsTrips, "Phiếu_Chuyển");
      } else {
        const wsEmpty = XLSX.utils.aoa_to_sheet([["Không có dữ liệu Phiếu Chuyển"]]);
        XLSX.utils.book_append_sheet(wb, wsEmpty, "Phiếu_Chuyển");
      }
    } else {
      console.warn("Không lấy được dữ liệu trips:", tripsRes);
      const wsErr = XLSX.utils.aoa_to_sheet([["Không lấy được dữ liệu Phiếu Chuyển"]]);
      XLSX.utils.book_append_sheet(wb, wsErr, "Phiếu_Chuyển");
    }

    // --- 1) Công Nợ (debts)
    if (debtsRes.status === "fulfilled" && debtsRes.value.ok) {
      const debts = await debtsRes.value.json();
      const debtsRows = (Array.isArray(debts) ? debts : []).map((d) => ({
        Ngày: _fmtDate(d.ngay),
        "Nội dung": d.noi_dung || "",
        "Loại GD": d.loai_gd || "",
        "Số tiền": _toNumber(d.so_tien),
        "Ghi chú": d.ghi_chu || "",
      }));
      if (debtsRows.length) {
        const wsDebt = XLSX.utils.json_to_sheet(debtsRows, {
          header: ["Ngày", "Nội dung", "Loại GD", "Số tiền", "Ghi chú"],
        });
        XLSX.utils.book_append_sheet(wb, wsDebt, "Công_Nợ");
      } else {
        // Nếu rỗng vẫn tạo sheet tiêu đề
        const wsEmpty = XLSX.utils.aoa_to_sheet([["Không có dữ liệu Công Nợ"]]);
        XLSX.utils.book_append_sheet(wb, wsEmpty, "Công_Nợ");
      }
    } else {
      console.warn("Không lấy được dữ liệu debts:", debtsRes);
      const wsErr = XLSX.utils.aoa_to_sheet([["Không lấy được dữ liệu Công Nợ"]]);
      XLSX.utils.book_append_sheet(wb, wsErr, "Công_Nợ");
    }

    // --- 3) Thu Chi (transactions) + tính SỐ DƯ theo startingBalance
    let startingBalance = 0;
    if (startBalRes.status === "fulfilled" && startBalRes.value.ok) {
      try {
        const sb = await startBalRes.value.json();
        startingBalance = _toNumber(sb.starting_balance ?? sb.startingBalance ?? 0);
      } catch (e) {
        startingBalance = 0;
      }
    }

    if (transactionsRes.status === "fulfilled" && transactionsRes.value.ok) {
      const transactions = await transactionsRes.value.json();
      const txArr = Array.isArray(transactions) ? transactions.slice() : [];

      // chắc chắn sắp xếp theo ngày tăng dần
      txArr.sort((a, b) => {
        const da = (a.date || a.ngay || "").slice(0, 10);
        const db = (b.date || b.ngay || "").slice(0, 10);
        return da.localeCompare(db);
      });

      let balance = startingBalance;
      const txRows = txArr.map((t) => {
        const amount = _toNumber(t.amount ?? t.so_tien ?? t.so_tien ?? 0);
        const isThu =
          String(t.category ?? t.loai_gd ?? "").toLowerCase() === "thu" || String(t.loai_gd ?? "").toLowerCase() === "thu";
        // nếu dữ liệu của bạn đánh dấu loại khác (ví dụ 'Chi'/'Thu') thì điều kiện trên có thể sửa
        balance += isThu ? amount : -amount;
        return {
          Ngày: _fmtDate(t.date ?? t.ngay),
          Tên: t.name ?? t.noi_dung ?? "",
          Loại: t.type ?? t.loai_gd ?? "",
          "Số tiền": amount,
          Khoản: t.category ?? "",
          "Số dư": balance,
          "Ghi chú": t.note ?? t.ghi_chu ?? "",
        };
      });

      if (txRows.length) {
        const wsTx = XLSX.utils.json_to_sheet(txRows, {
          header: ["Ngày", "Tên", "Loại", "Số tiền", "Khoản", "Số dư", "Ghi chú"],
        });
        XLSX.utils.book_append_sheet(wb, wsTx, "Thu_Chi");
      } else {
        const wsEmpty = XLSX.utils.aoa_to_sheet([["Không có dữ liệu Thu Chi"]]);
        XLSX.utils.book_append_sheet(wb, wsEmpty, "Thu_Chi");
      }
    } else {
      console.warn("Không lấy được dữ liệu transactions:", transactionsRes);
      const wsErr = XLSX.utils.aoa_to_sheet([["Không lấy được dữ liệu Thu Chi"]]);
      XLSX.utils.book_append_sheet(wb, wsErr, "Thu_Chi");
    }

    // ghi file
    const filename = `Bao_cao_${toDayString}.xlsx`;
    XLSX.writeFile(wb, filename);
  } catch (err) {
    console.error("Lỗi exportAllExcel:", err);
    alert("Không thể tạo file Excel: " + (err && err.message ? err.message : err));
  }
}
