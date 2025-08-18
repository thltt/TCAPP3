const API_TRIPS = "https://tcapp2.onrender.com/api/trips";

// Load danh sách phiếu chuyến khi mở trang
document.addEventListener("DOMContentLoaded", fetchTrips);

async function fetchTrips() {
  try {
    const res = await fetch(API_TRIPS);
    const trips = await res.json();
    renderTable(trips);
  } catch (err) {
    console.error("❌ Lỗi khi lấy phiếu chuyến:", err);
  }
}

function renderTable(trips) {
  const tbody = document.querySelector("#transTable tbody");
  tbody.innerHTML = "";

  trips.forEach((t) => {
    // Định dạng ngày dd-mm-yyyy
    const formattedDate = t.ngay
      ? (() => {
          const [year, month, day] = t.ngay.slice(0, 10).split("-");
          return `${parseInt(day)}-${parseInt(month)}-${year}`;
        })()
      : "";

    // Xác định class cho số tiền
    let amountClass = "currency";
    if (t.so_tien > 0) amountClass += " positive";
    else if (t.so_tien < 0) amountClass += " negative";

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${formattedDate}</td>
      <td>${t.so_chuyen}</td>
      <td>${t.cong_ty || ""}</td>
      <td>${t.cung_duong || ""}</td>
      <td>${t.so_khoi}</td>
      <td>${t.don_gia}</td>
      <td class="${amountClass}">${t.so_tien}</td>
      <td>${t.tinh_trang}</td>
      <td>${t.ghi_chu || ""}</td>
      <td><button class="delete-btn" onclick="deleteTrip(${t.id})">Xóa</button></td>
    `;
    tbody.appendChild(row);
  });
}

// Thêm phiếu chuyến
async function addRow() {
  const ngay = document.getElementById("dateInput").value;
  const so_chuyen = parseInt(document.getElementById("soChuyenInput").value) || 0;
  const cong_ty = document.getElementById("congTyInput").value;
  const cung_duong = document.getElementById("cungDuongInput").value;
  const so_khoi = parseFloat(document.getElementById("soKhoiInput").value) || 0;
  const don_gia = parseFloat(document.getElementById("donGiaInput").value) || 0;
  const tinh_trang = document.getElementById("tinhTrangInput").value;
  const ghi_chu = document.getElementById("ghiChuInput").value;

  const so_tien = so_chuyen * so_khoi * don_gia;

  const trip = { ngay, so_chuyen, cong_ty, cung_duong, so_khoi, don_gia, so_tien, tinh_trang, ghi_chu };

  try {
    await fetch(API_TRIPS, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(trip),
    });
    clearInputs();
    fetchTrips();
  } catch (err) {
    console.error("❌ Lỗi khi thêm phiếu chuyến:", err);
  }
}

// Xóa phiếu chuyến
async function deleteTrip(id) {
  try {
    await fetch(`${API_TRIPS}/${id}`, { method: "DELETE" });
    fetchTrips();
  } catch (err) {
    console.error("❌ Lỗi khi xoá phiếu chuyến:", err);
  }
}

// Xóa/Reset input
function clearInputs() {
  document.querySelectorAll("input, select").forEach((el) => (el.value = ""));
}
