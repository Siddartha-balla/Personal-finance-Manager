const express = require("express");

const { testExpense,addExpense,getExpenses,updateExpense,deleteExpense } = require("../controllers/expenseController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", authMiddleware, testExpense);
router.post("/", authMiddleware, addExpense);
router.get("/all",authMiddleware,getExpenses);
router.put("/:id",authMiddleware,updateExpense);
router.delete("/:id",authMiddleware,deleteExpense);
module.exports = router;