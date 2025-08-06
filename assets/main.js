let balance = 0;

function formatCurrency(number) {
  return Number(number).toLocaleString("vi-VN");
}

// Tải danh sách giao dịch từ server
async function fetchTransactions() {
  try {
    const response = await fetch("https://tcapp2.onrender.com/api/transactions");
    const transactions = await response.json();
    renderTable(transactions);
  } catch (error) {
    console.error("Không thể kết nối server:", error);
    alert("Không thể kết nối tới server.");
  }
}

// Hiển thị bảng dữ liệu
function renderTable(transactions) {
  const tableBody = document.getElementById("transactionTable").getElementsByTagName("tbody")[0];

  // Xóa tất cả hàng sau dòng "TỒN ĐẦU"
  while (tableBody.rows.length > 1) {
    tableBody.deleteRow(1);
  }

  balance = 0;
  transactions.forEach((t) => {
    const row = tableBody.insertRow(-1);
    const amount = parseFloat(t.amount);
    const formattedDate = t.date.slice(0, 10); // yyyy-mm-dd

    balance += t.category === "Thu" ? amount : -amount;

    row.innerHTML = `
      <td>${formattedDate}</td>
      <td>${t.name}</td>
      <td>${t.type}</td>
      <td class="currency">${formatCurrency(amount)}</td>
      <td>${t.category}</td>
      <td class="currency">${formatCurrency(balance)}</td>
      <!-- <td>${t.note || ""}</td>  -->
      <td><button onclick="deleteTransaction(${t.id})">Xóa</button></td>
    `;
  });

  document.getElementById("startingBalance").innerText = formatCurrency(0);
}

// Gửi dữ liệu lên server khi bấm "Thêm"
async function addRow() {
  const date = document.getElementById("dateInput").value;
  const name = document.getElementById("nameInput").value;
  const type = document.getElementById("typeInput").value;
  const amount = parseFloat(document.getElementById("amountInput").value);
  const category = document.getElementById("categoryInput").value;

  if (!date || !type || isNaN(amount)) {
    alert("Vui lòng nhập đầy đủ thông tin.");
    return;
  }

  const data = {
    date,
    name,
    type,
    amount,
    category,
    note: "", // bạn có thể thêm input ghi chú nếu muốn
  };

  try {
    const response = await fetch("https://tcapp2.onrender.com/api/transactions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      await fetchTransactions(); // cập nhật lại bảng
      clearInputs();
    } else {
      alert("Lỗi khi thêm giao dịch.");
    }
  } catch (error) {
    console.error("Lỗi kết nối server:", error);
    alert("Không kết nối được tới server.");
  }
}

// Gọi API xóa giao dịch
async function deleteTransaction(id) {
  if (!confirm("Bạn có chắc chắn muốn xóa dòng này?")) return;

  try {
    const response = await fetch(`https://tcapp2.onrender.com/api/transactions/${id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      await fetchTransactions();
    } else {
      alert("Xóa không thành công.");
    }
  } catch (error) {
    console.error("Lỗi khi xóa:", error);
    alert("Không thể kết nối tới server để xóa.");
  }
}

// Xóa dữ liệu trên form
function clearInputs() {
  document.getElementById("dateInput").value = "";
  document.getElementById("nameInput").value = "Phượng";
  document.getElementById("typeInput").value = "";
  document.getElementById("amountInput").value = "";
  document.getElementById("categoryInput").value = "Thu";
}

// Tự động tải lại khi trang được mở
window.onload = fetchTransactions;

// Xuất Excel
function exportToExcel() {
  const table = document.getElementById("transactionTable");
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.table_to_sheet(table, { raw: true });

  Object.keys(ws).forEach((cell) => {
    if (cell[0] === "!") return; // bỏ qua metadata
    const raw = ws[cell].v;

    if (typeof raw === "string" && raw.match(/^\d{1,3}(\.\d{3})*$/)) {
      const numberValue = Number(raw.replace(/\./g, "")); // bỏ dấu chấm
      ws[cell].v = numberValue; // gán lại giá trị số
      ws[cell].t = "n"; // ép kiểu number
    }
  });

  XLSX.utils.book_append_sheet(wb, ws, "GiaoDich");

  XLSX.writeFile(wb, `Thu_Chi.xlsx`);
}
