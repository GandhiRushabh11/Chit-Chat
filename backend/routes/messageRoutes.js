const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const {
  sendMessage,
  fetchMessage,
} = require("../controllers/messageControllers");

const router = express.Router();

router.post("/", protect, sendMessage);
router.get("/:chatId", protect, fetchMessage);

module.exports = router;
