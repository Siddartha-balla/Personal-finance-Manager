const pool = require("../config/db");

const testIncome = (req, res) => {
    res.json({
        success: true,
        message: "Income API is working",
        userId: req.userId
    });
};
//Adding Income
const addIncome = async (req, res) => {
    try {
        const { amount, source, description, income_date } = req.body;

        // Validate required fields
        if (!amount || !source || !income_date) {
            return res.status(400).json({
                success: false,
                message: "Amount, source and income date are required"
            });
        }

        // Insert income for the logged-in user
        const [result] = await pool.execute(
            `INSERT INTO income
            (user_id, amount, source, description, income_date)
            VALUES (?, ?, ?, ?, ?)`,
            [
                req.userId,
                amount,
                source,
                description || null,
                income_date
            ]
        );

        res.status(201).json({
            success: true,
            message: "Income added successfully",
            incomeId: result.insertId
        });

    } catch (error) {
        console.error("Add income error:", error.message);

        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

//retriving all incomes
const getIncome = async (req, res) => {
    try {
        const [income] = await pool.execute(
            `SELECT id, amount, source, description, income_date, created_at
             FROM income
             WHERE user_id = ?
             ORDER BY income_date DESC`,
            [req.userId]
        );

        res.status(200).json({
            success: true,
            income: income
        });

    } catch (error) {
        console.error("Get income error:", error.message);

        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

//updating the income
const updateIncome = async (req, res) => {
    try {
        const incomeId = req.params.id;
        const { amount, source, description, income_date } = req.body;

        if (!amount || !source || !income_date) {
            return res.status(400).json({
                success: false,
                message: "Amount, source and income date are required"
            });
        }

        const [result] = await pool.execute(
            `UPDATE income
             SET amount = ?, source = ?, description = ?, income_date = ?
             WHERE id = ? AND user_id = ?`,
            [
                amount,
                source,
                description || null,
                income_date,
                incomeId,
                req.userId
            ]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Income record not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Income updated successfully"
        });

    } catch (error) {
        console.error("Update income error:", error.message);

        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

//Deleting the income
const deleteIncome = async (req, res) => {
    try {
        const incomeId = req.params.id;

        const [result] = await pool.execute(
            `DELETE FROM income
             WHERE id = ? AND user_id = ?`,
            [incomeId, req.userId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Income record not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Income deleted successfully"
        });

    } catch (error) {
        console.error("Delete income error:", error.message);

        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};
module.exports = {
    testIncome,
    addIncome,
    getIncome,
    updateIncome,
    deleteIncome
};