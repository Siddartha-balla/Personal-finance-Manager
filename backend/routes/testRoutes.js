const express = require("express");
const testController = require("../controllers/testController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", testController);

router.get("/protected", authMiddleware, (req, res) => {
    res.json({
        success: true,
        message: "You have access to the protected route",
        userId: req.userId
    });
});

module.exports = router;