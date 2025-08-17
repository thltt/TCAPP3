function addRow() {
  const date = document.getElementById("dateInput").value;
  const soChuyen = document.getElementById("soChuyenInput").value;
  const congTy = document.getElementById("congTyInput").value;
  const cungDuong = document.getElementById("cungDuongInput").value;
  const soKhoi = parseFloat(document.getElementById("soKhoiInput").value) || 0;
  const donGia = parseFloat(document.getElementById("donGiaInput").value) || 0;
  const tinhTrang = document.getElementById("tinhTrangInput").value;
  const ghiChu = document.getElementById("ghiChuInput").value;

  const soTien = soKhoi * donGia;

  const table = document.getElementById("transactionTable").querySelector("tbody");
  const row = table.insertRow();

  row.innerHTML = `
        <td>${date}</td>
        <td>${soChuyen}</td>
        <td>${congTy}</td>
        <td>${cungDuong}</td>
        <td>${soKhoi}</td>
        <td>${donGia.toLocaleString()}</td>
        <td>${soTien.toLocaleString()}</td>
        <td>${tinhTrang}</td>
        <td>${ghiChu}</td>
        <td><button class="delete-btn" onclick="deleteRow(this)">Xóa</button></td>
      `;
}

function clearInputs() {
  document.querySelectorAll(".input-group input").forEach((input) => (input.value = ""));
  document.getElementById("tinhTrangInput").value = "NỢ";
}

function deleteRow(button) {
  button.parentElement.parentElement.remove();
}
