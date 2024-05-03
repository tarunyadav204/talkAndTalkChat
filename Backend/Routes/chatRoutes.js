const express = require('express');
const { protect } = require('../Middlewares/authMiddleware');
const { accessChat, fetchChats, createGroupChat, renameGroup, addToGroup, removeToGroup } = require('../Controllers/chatsController')

const router = express.Router();

router.route("/").post(protect, accessChat);
router.route("/").get(protect, fetchChats);
router.route("/group").post(protect, createGroupChat);
router.route("/rename").put(protect, renameGroup);
router.route("/groupremove").put(protect, removeToGroup);
router.route("/groupadd").put(protect, addToGroup);


module.exports = router;