const express = require("express");

const {
    testIncome,
    addIncome,
    getIncome,
    updateIncome,
    deleteIncome
} = require("../controllers/incomeController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", authMiddleware, testIncome);
router.post("/", authMiddleware, addIncome);//adding
router.get("/all", authMiddleware, getIncome);//retriving
router.put("/:id", authMiddleware, updateIncome);//update
router.delete("/:id", authMiddleware, deleteIncome);//deleting
module.exports = router;