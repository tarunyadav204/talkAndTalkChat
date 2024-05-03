const express = require("express");
const { protect } = require("../Middlewares/authMiddleware");
const { sendMessage, allMessages     } = require("../Controllers/messageController");
const router = express.Router();

// Define the route for sending a message
router.route("/:chatId").get(protect, allMessages);
router.post("/", protect, sendMessage);

module.exports = router;
