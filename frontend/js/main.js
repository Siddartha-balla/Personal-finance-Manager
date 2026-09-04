const token = localStorage.getItem("token");
const user = JSON.parse(localStorage.getItem("user"));
let editingIncomeId = null;
let editingExpenseId = null;
// Check if user is logged in
if (!token) {
    window.location.href = "login.html";
}


// Display user's name
if (user) {
    document.getElementById("welcomeMessage").textContent =
        `Welcome, ${user.name}`;
}


// Fetch income
async function fetchIncome() {
    try {
        const response = await fetch(
            "http://localhost:5000/api/income/all",
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        const data = await response.json();
        if (response.status === 401) {//if token expires
    logoutUser();
    return [];
}
        if (!data.success) {
            console.error(data.message);
            return [];
        }

        return data.income;

    } catch (error) {
        console.error("Error fetching income:", error);
        return [];
    }
}


// Fetch expenses
async function fetchExpenses() {
    try {
        const response = await fetch(
            "http://localhost:5000/api/expense/all",
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        const data = await response.json();
        if (response.status === 401) {
    logoutUser();
    return [];
}
        if (!data.success) {
            console.error(data.message);
            return [];
        }

        return data.expenses;

    } catch (error) {
        console.error("Error fetching expenses:", error);
        return [];
    }
}
//fetching categories
async function fetchCategories() {
    try {
        const response = await fetch(
            "http://localhost:5000/api/categories"
        );

        const data = await response.json();

        if (!data.success) {
            console.error(data.message);
            return [];
        }

        return data.categories;

    } catch (error) {
        console.error("Error fetching categories:", error);
        return [];
    }
}
//displaying categories
function displayCategories(categories) {
    const categorySelect = document.getElementById("expenseCategory");

    categorySelect.innerHTML = `
        <option value="">Select category</option>
    `;

    categories.forEach(category => {
        const option = document.createElement("option");

        option.value = category.id;
        option.textContent = category.name;

        categorySelect.appendChild(option);
    });
}

// Display income
function displayIncome(income) {

    const incomeList = document.getElementById("incomeList");

    if (income.length === 0) {
        incomeList.innerHTML = "<p>No income records yet.</p>";
        return;
    }

    incomeList.innerHTML = "";

    income.forEach(item => {

        const div = document.createElement("div");
div.classList.add("transaction-item");
        div.innerHTML = `
    <div class="transaction-details">
        <div>
            <strong>₹${item.amount}</strong>
            <span>${item.source}</span>
        </div>

        <p>${item.description || "No description"}</p>
        <small>${item.income_date.split("T")[0]}</small>
    </div>

    <div class="transaction-actions">
        <button class="edit-income" data-id="${item.id}">
            Edit
        </button>

        <button class="delete-income" data-id="${item.id}">
            Delete
        </button>
    </div>
`;

        incomeList.appendChild(div);
    });
}
//edit income
document.getElementById("incomeList").addEventListener("click", async (event) => {

    if (!event.target.classList.contains("edit-income")) {
        return;
    }

    const incomeId = event.target.dataset.id;

    const income = await fetchIncome();

    const selectedIncome = income.find(
        item => item.id == incomeId
    );

    if (!selectedIncome) {
        alert("Income record not found");
        return;
    }

    editingIncomeId = incomeId;
    window.scrollTo({
    top: 0,
    behavior: "smooth"
});
document.getElementById("incomeSubmitBtn").textContent = "Save Edit";

document.getElementById("cancelIncomeEditBtn").style.display = "inline-block";
    document.getElementById("incomeAmount").value =
        selectedIncome.amount;

    document.getElementById("incomeSource").value =
        selectedIncome.source;

    document.getElementById("incomeDescription").value =
        selectedIncome.description || "";

    document.getElementById("incomeDate").value =
    selectedIncome.income_date.split("T")[0];
    
});
document.getElementById("cancelIncomeEditBtn").addEventListener("click", () => {

    editingIncomeId = null;

    document.getElementById("incomeForm").reset();

    document.getElementById("incomeSubmitBtn").textContent = "Add Income";

    document.getElementById("cancelIncomeEditBtn").style.display = "none";
});
//edit expense
document.getElementById("expenseList").addEventListener("click", async (event) => {

    if (!event.target.classList.contains("edit-expense")) {
        return;
    }

    const expenseId = event.target.dataset.id;

    const expenses = await fetchExpenses();

    const selectedExpense = expenses.find(
        item => item.id == expenseId
    );

    if (!selectedExpense) {
        alert("Expense record not found");
        return;
    }

    editingExpenseId = expenseId;

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

    document.getElementById("expenseAmount").value =
        selectedExpense.amount;

    document.getElementById("expenseDescription").value =
        selectedExpense.description || "";

    document.getElementById("expenseDate").value =
        selectedExpense.expense_date.split("T")[0];

    document.getElementById("expenseSubmitBtn").textContent =
        "Save Edit";

    document.getElementById("cancelExpenseEditBtn").style.display =
        "inline-block";

    document.getElementById("expenseCategory").value =
        selectedExpense.category_id;
});
document.getElementById("cancelExpenseEditBtn").addEventListener("click", () => {

    editingExpenseId = null;

    document.getElementById("expenseForm").reset();

    document.getElementById("expenseSubmitBtn").textContent = "Add Expense";

    document.getElementById("cancelExpenseEditBtn").style.display = "none";
});
//delete income
document.getElementById("incomeList").addEventListener("click", async (event) => {

    if (!event.target.classList.contains("delete-income")) {
        return;
    }

    const incomeId = event.target.dataset.id;

    const confirmDelete = confirm("Are you sure you want to delete this income?");

    if (!confirmDelete) {
        return;
    }

    try {

        const response = await fetch(
            `http://localhost:5000/api/income/${incomeId}`,
            {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        const data = await response.json();

        if (data.success) {
            await loadDashboard();
        } else {
            alert(data.message);
        }

    } catch (error) {

        console.error("Delete income error:", error);
        alert("Unable to connect to server");
    }
});
//delete expense
document.getElementById("expenseList").addEventListener("click", async (event) => {

    if (!event.target.classList.contains("delete-expense")) {
        return;
    }

    const expenseId = event.target.dataset.id;

    const confirmDelete = confirm(
        "Are you sure you want to delete this expense?"
    );

    if (!confirmDelete) {
        return;
    }

    try {

        const response = await fetch(
            `http://localhost:5000/api/expense/${expenseId}`,
            {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        const data = await response.json();

        if (data.success) {
            await loadDashboard();
        } else {
            alert(data.message);
        }

    } catch (error) {

        console.error("Delete expense error:", error);
        alert("Unable to connect to server");
    }
});
// Display expenses
function displayExpenses(expenses) {

    const expenseList = document.getElementById("expenseList");

    if (expenses.length === 0) {
        expenseList.innerHTML = "<p>No expense records yet.</p>";
        return;
    }

    expenseList.innerHTML = "";

    expenses.forEach(item => {

        const div = document.createElement("div");
div.classList.add("transaction-item");
       div.innerHTML = `
    <div class="transaction-details">
        <div>
            <strong>₹${item.amount}</strong>
            <span>${item.category}</span>
        </div>

        <p>${item.description || "No description"}</p>
        <small>${item.expense_date.split("T")[0]}</small>
    </div>

    <div class="transaction-actions">
        <button class="edit-expense" data-id="${item.id}">
            Edit
        </button>

        <button class="delete-expense" data-id="${item.id}">
            Delete
        </button>
    </div>
`;

        expenseList.appendChild(div);
    });
}
// Calculate summary
function updateSummary(income, expenses) {

    const totalIncome = income.reduce(
        (sum, item) => sum + Number(item.amount),
        0
    );

    const totalExpense = expenses.reduce(
        (sum, item) => sum + Number(item.amount),
        0
    );

    const balance = totalIncome - totalExpense;

    document.getElementById("totalIncome").textContent =
        `₹${totalIncome.toFixed(2)}`;

    document.getElementById("totalExpense").textContent =
        `₹${totalExpense.toFixed(2)}`;

    document.getElementById("balance").textContent =
        `₹${balance.toFixed(2)}`;
}


// Load dashboard
async function loadDashboard() {

    const income = await fetchIncome();
    const expenses = await fetchExpenses();
    const categories=await fetchCategories();

    displayIncome(income);
    displayExpenses(expenses);
    displayCategories(categories);
    updateSummary(income, expenses);
}


loadDashboard();
// Add Income
document.getElementById("incomeForm").addEventListener("submit", async (event) => {

    event.preventDefault();

    const amount = document.getElementById("incomeAmount").value;
    const source = document.getElementById("incomeSource").value;
    const description = document.getElementById("incomeDescription").value;
    const income_date = document.getElementById("incomeDate").value;

    try {

    const url = editingIncomeId
        ? `http://localhost:5000/api/income/${editingIncomeId}`
        : "http://localhost:5000/api/income";

    const method = editingIncomeId ? "PUT" : "POST";

    const response = await fetch(url, {
        method: method,

        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },

        body: JSON.stringify({
            amount,
            source,
            description,
            income_date
        })
    });

        const data = await response.json();

        document.getElementById("incomeMessage").textContent =
            data.message;

        if (data.success) {

    document.getElementById("incomeForm").reset();

    editingIncomeId = null;

    document.getElementById("incomeSubmitBtn").textContent = "Add Income";

    document.getElementById("cancelIncomeEditBtn").style.display = "none";

    await loadDashboard();
}

    } catch (error) {

        console.error("Add income error:", error);

        document.getElementById("incomeMessage").textContent =
            "Unable to connect to server";
    }
});


// Add Expense
document.getElementById("expenseForm").addEventListener("submit", async (event) => {

    event.preventDefault();

    const amount = document.getElementById("expenseAmount").value;
    const category_id = document.getElementById("expenseCategory").value;
    const description = document.getElementById("expenseDescription").value;
    const expense_date = document.getElementById("expenseDate").value;

    try {

        const url = editingExpenseId
            ? `http://localhost:5000/api/expense/${editingExpenseId}`
            : "http://localhost:5000/api/expense";

        const method = editingExpenseId ? "PUT" : "POST";

        const response = await fetch(url, {
            method: method,

            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },

            body: JSON.stringify({
                category_id,
                amount,
                description,
                expense_date
            })
        });

        const data = await response.json();

        document.getElementById("expenseMessage").textContent =
            data.message;

        if (data.success) {

            document.getElementById("expenseForm").reset();

            editingExpenseId = null;

            document.getElementById("expenseSubmitBtn").textContent =
                "Add Expense";

            document.getElementById("cancelExpenseEditBtn").style.display =
                "none";

            await loadDashboard();
        }

    } catch (error) {

        console.error("Expense error:", error);

        document.getElementById("expenseMessage").textContent =
            "Unable to connect to server";
    }
});

// Logout
function logoutUser() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.location.href = "login.html";
}
document.getElementById("logoutBtn").addEventListener("click", () => {
    logoutUser();
});
