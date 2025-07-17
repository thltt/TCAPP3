let balance = 0;

function formatCurrency(number) {
  return Number(number).toLocaleString("vi-VN");
}

async function fetchTransactions() {
  const response = await fetch("http://localhost:3000/api/transactions");
  const transactions = await response.json();
  renderTable(transactions);
}

function renderTable(transactions) {
  const tableBody = document.getElementById("transactionTable").getElementsByTagName("tbody")[0];

  // Xóa tất cả hàng, trừ dòng "TỒN ĐẦU"
  while (tableBody.rows.length > 1) {
    tableBody.deleteRow(1);
  }

  balance = 0;
  transactions.forEach((t) => {
    const row = tableBody.insertRow(-1);
    const amount = parseFloat(t.amount);

    balance += t.category === "Thu" ? amount : -amount;

    row.innerHTML = `
      <td>${t.date}</td>
      <td>${t.name}</td>
      <td>${t.type}</td>
      <td class="currency">${formatCurrency(amount)}</td>
      <td>${t.category}</td>
      <td class="currency">${formatCurrency(balance)}</td>
      <td>${t.note || ""}</td>
      <td><!-- Xóa có thể bổ sung sau --></td>
    `;
  });

  document.getElementById("startingBalance").innerText = formatCurrency(0);
}

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
    note: "", // có thể bổ sung input ghi chú sau
  };

  try {
    const response = await fetch("http://localhost:3000/api/transactions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      await fetchTransactions(); // tải lại sau khi thêm
      clearInputs();
    } else {
      alert("Lỗi khi thêm giao dịch.");
    }
  } catch (error) {
    console.error("Lỗi kết nối server:", error);
    alert("Không kết nối được tới server.");
  }
}

function clearInputs() {
  document.getElementById("dateInput").value = "";
  document.getElementById("nameInput").value = "Phượng";
  document.getElementById("typeInput").value = "";
  document.getElementById("amountInput").value = "";
  document.getElementById("categoryInput").value = "Thu";
}

// Tự động tải dữ liệu khi trang load
window.onload = fetchTransactions;
