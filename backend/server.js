const express = require("express");
const pool = require("./config/db");
const testRoutes = require("./routes/testRoutes");

const app = express();
app.use(express.json());
const PORT = 5000;

app.use("/api/test", testRoutes);

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