const pool = require("../config/db");

const testExpense = (req, res) => {
    res.json({
        success: true,
        message: "Expense API is working",
        userId: req.userId
    });
};
// adding new expense
const addExpense = async (req, res) => {
    try {
        const {
            category_id,
            amount,
            description,
            expense_date
        } = req.body;

        // Validate required fields
        if (!category_id || !amount || !expense_date) {
            return res.status(400).json({
                success: false,
                message: "Category, amount and expense date are required"
            });
        }

        // Insert expense for the logged-in user
        const [result] = await pool.execute(
            `INSERT INTO expenses
            (user_id, category_id, amount, description, expense_date)
            VALUES (?, ?, ?, ?, ?)`,
            [
                req.userId,
                category_id,
                amount,
                description || null,
                expense_date
            ]
        );

        res.status(201).json({
            success: true,
            message: "Expense added successfully",
            expenseId: result.insertId
        });

    } catch (error) {
        console.error("Add expense error:", error.message);

        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

//retriving all expenses
const getExpenses = async (req, res) => {
    try {
        const [expenses] = await pool.execute(
            `SELECT
                expenses.id,
                expenses.category_id,
                expenses.amount,
                categories.name AS category,
                expenses.description,
                expenses.expense_date,
                expenses.created_at
             FROM expenses
             INNER JOIN categories
                ON expenses.category_id = categories.id
             WHERE expenses.user_id = ?
             ORDER BY expenses.expense_date DESC`,
            [req.userId]
        );

        res.status(200).json({
            success: true,
            expenses: expenses
        });

    } catch (error) {
        console.error("Get expenses error:", error.message);

        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};
//updating expense record
const updateExpense = async (req, res) => {
    try {
        const expenseId = req.params.id;

        const {
            category_id,
            amount,
            description,
            expense_date
        } = req.body;

        if (!category_id || !amount || !expense_date) {
            return res.status(400).json({
                success: false,
                message: "Category, amount and expense date are required"
            });
        }

        const [result] = await pool.execute(
            `UPDATE expenses
             SET category_id = ?, amount = ?, description = ?, expense_date = ?
             WHERE id = ? AND user_id = ?`,
            [
                category_id,
                amount,
                description || null,
                expense_date,
                expenseId,
                req.userId
            ]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Expense record not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Expense updated successfully"
        });

    } catch (error) {
        console.error("Update expense error:", error.message);

        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};
//deleing expense record
const deleteExpense = async (req, res) => {
    try {
        const expenseId = req.params.id;

        const [result] = await pool.execute(
            `DELETE FROM expenses
             WHERE id = ? AND user_id = ?`,
            [expenseId, req.userId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Expense record not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Expense deleted successfully"
        });

    } catch (error) {
        console.error("Delete expense error:", error.message);

        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};
module.exports = {
    testExpense,
    addExpense,
    getExpenses,
    updateExpense,
    deleteExpense
};