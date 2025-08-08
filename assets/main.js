let balance = 0;
let transactions = [];

function formatCurrency(number) {
  return Number(number).toLocaleString("vi-VN");
}

// Tải danh sách giao dịch từ server
async function fetchTransactions() {
  try {
    const response = await fetch("https://tcapp2.onrender.com/api/transactions");
    transactions = await response.json();
    renderTable(transactions);
  } catch (error) {
    console.error("Không thể kết nối server:", error);
    alert("Không thể kết nối tới server.");
  }
}

// Nhập giá trị tồn đầu
async function inputStartingBalance() {
  const inputElement = document.getElementById("startingBalanceInput");
  const inputValue = parseFloat(inputElement.value);
  if (isNaN(inputValue)) {
    alert("Vui lòng nhập số hợp lệ.");
    return;
  }

  // Gửi lên server
  try {
    const response = await fetch("https://tcapp2.onrender.com/api/starting-balance", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ starting_balance: inputValue }),
    });

    if (!response.ok) throw new Error("Lỗi khi lưu tồn đầu");

    document.getElementById("startingBalance").innerText = formatCurrency(inputValue);
    renderTable(transactions, inputValue);
    inputElement.value = "";
  } catch (err) {
    console.error(err);
    alert("Không thể lưu tồn đầu lên server.");
  }
}

// Xóa giá trị tồn đầu
function deleteStartingBalance() {
  document.getElementById("startingBalance").innerText = 0;
}

// Lấy giá trị tồn đầu khi mở trang
async function fetchStartingBalance() {
  try {
    const res = await fetch("https://tcapp2.onrender.com/api/starting-balance");
    const data = await res.json();
    const startingBalance = parseFloat(data.starting_balance) || 0;

    document.getElementById("startingBalance").innerText = formatCurrency(startingBalance);
    renderTable(transactions, startingBalance);
  } catch (error) {
    console.error("Không thể tải tồn đầu:", error);
    renderTable(transactions, 0);
  }
}

// Hiển thị bảng dữ liệu
function renderTable(transactions, startingBalance = 0) {
  const tableBody = document.getElementById("transactionTable").getElementsByTagName("tbody")[0];

  // Xóa tất cả hàng sau dòng "TỒN ĐẦU"
  while (tableBody.rows.length > 1) {
    tableBody.deleteRow(1);
  }

  // Tính số dư từ dưới lên (dựa vào startingBalance)
  let balance = startingBalance;
  const balances = [];
  for (let i = transactions.length - 1; i >= 0; i--) {
    const amount = parseFloat(transactions[i].amount);
    balance += transactions[i].category === "Thu" ? amount : -amount;
    balances[i] = balance;
  }

  // Hiển thị bảng từ mới đến cũ
  transactions.forEach((t, index) => {
    const row = tableBody.insertRow(-1);
    const amount = parseFloat(t.amount);
    const formattedDate = t.date.slice(0, 10);

    row.innerHTML = `
      <td>${formattedDate}</td>
      <td>${t.name}</td>
      <td>${t.type}</td>
      <td class="currency">${formatCurrency(amount)}</td>
      <td>${t.category}</td>
      <td class="currency">${formatCurrency(balances[index])}</td>
      <td><button onclick="deleteTransaction(${t.id})">Xóa</button></td>
    `;
  });

  // Cập nhật lại hiển thị tồn đầu (dự phòng)
  document.getElementById("startingBalance").innerText = formatCurrency(startingBalance);
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
    note: "",
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
// window.onload = fetchTransactions;
window.onload = async function () {
  try {
    const resBalance = await fetch("https://tcapp2.onrender.com/api/starting-balance");
    const dataBalance = await resBalance.json();
    const startingBalance = parseFloat(dataBalance.starting_balance) || 0;

    const resTransactions = await fetch("https://tcapp2.onrender.com/api/transactions");
    transactions = await resTransactions.json();

    renderTable(transactions, startingBalance);
    document.getElementById("startingBalance").innerText = formatCurrency(startingBalance);
  } catch (err) {
    console.error("Lỗi tải dữ liệu:", err);
    alert("Không thể tải dữ liệu từ server.");
  }
};

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
