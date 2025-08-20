const API_DEBTS = "http://localhost:8050/api/debt";

window.onload = fetchDebts();

// Định dạng số tiền
function formatCurrency(number) {
  return Number(number || "").toLocaleString("vi-VN");
}

async function fetchDebts() {
  try {
    const res = await fetch(API_DEBTS);
    if (!res.ok) throw new Error("Không thể kết nối server!");
    const debt = await res.json();
    renderTable(debt);
  } catch (err) {
    console.error("❌ Lỗi khi lấy phiếu chuyến:", err);
    alert("Không thể kết nối tới server. Vui lòng thử lại sau.");
  }
}

function renderTable(debt) {
  const tbody = document.querySelector("#transDebtTable tbody");
  tbody.innerHTML = "";

  debt.forEach((t) => {
    const formattedDate = t.ngay
      ? (() => {
          const [year, month, day] = t.ngay.slice(0, 10).split("-");
          return `${parseInt(day)}-${parseInt(month)}-${year}`;
        })()
      : "";
    const formattedSoTien = formatCurrency(t.so_tien);
    const row = document.createElement("tr");
    row.innerHTML = `
        <td>${formattedDate}</td>
        <td>${t.noi_dung}</td>
        <td>${t.loai_gd}</td>
        <td>${formattedSoTien}</td>
        <td>${t.ghi_chu}</td>
        <td><button class="delete-btn" onclick="deleteDebt(${t.id})">Xóa</button></td>
    `;
    tbody.appendChild(row);
  });
}
