const express = require("express");
const pool = require("./config/db");
const cors = require("cors");
const testRoutes = require("./routes/testRoutes");
const authRoutes = require("./routes/authRoutes");
const incomeRoutes = require("./routes/incomeRoutes");
const expenseRoutes = require("./routes/expenseRoutes");
const categoryRoute=require("./routes/categoriesRoutes");
const app = express();


const PORT = 5000;
app.use(cors());
app.use(express.json());
app.use("/api/test", testRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/income",incomeRoutes);
app.use("/api/expense",expenseRoutes);
app.use("/api/categories",categoryRoute);
app.get("/", (req, res) => {
    res.send("Personal Finance Manager API is running");
});

async function testDatabaseConnection() {
    try {
        const connection = await pool.getConnection();


        console.log("MySQL database connected successfully");

        connection.release();
    } catch (error) {
        console.error("MySQL connection failed:", error.message);
    }
}

testDatabaseConnection();

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});