const token = localStorage.getItem("token");
const user = JSON.parse(localStorage.getItem("user"));


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

        div.innerHTML = `
            <p>
                <strong>₹${item.amount}</strong>
                - ${item.source}
            </p>
            <p>${item.description || ""}</p>
            <p>${item.income_date}</p>
            <hr>
        `;

        incomeList.appendChild(div);
    });
}


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

        div.innerHTML = `
            <p>
                <strong>₹${item.amount}</strong>
                - ${item.category}
            </p>
            <p>${item.description || ""}</p>
            <p>${item.expense_date}</p>
            <hr>
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

    displayIncome(income);
    displayExpenses(expenses);

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

        const response = await fetch(
            "http://localhost:5000/api/income",
            {
                method: "POST",

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
            }
        );

        const data = await response.json();

        document.getElementById("incomeMessage").textContent =
            data.message;

        if (data.success) {

            document.getElementById("incomeForm").reset();

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

        const response = await fetch(
            "http://localhost:5000/api/expense",
            {
                method: "POST",

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
            }
        );

        const data = await response.json();

        document.getElementById("expenseMessage").textContent =
            data.message;

        if (data.success) {

            document.getElementById("expenseForm").reset();

            await loadDashboard();
        }

    } catch (error) {

        console.error("Add expense error:", error);

        document.getElementById("expenseMessage").textContent =
            "Unable to connect to server";
    }
});

// Logout
document.getElementById("logoutBtn").addEventListener("click", () => {

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.location.href = "login.html";
});