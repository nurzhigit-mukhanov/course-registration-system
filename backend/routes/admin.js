const express = require("express");
const { createUser, deleteUser } = require("../controllers/adminController");
const { adminMiddleware } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/users", adminMiddleware, createUser);
router.delete("/users/:userId", adminMiddleware, deleteUser);

module.exports = router;
