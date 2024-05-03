const express = require('express');
const { register, authUser, allUsers } = require('../Controllers/userControllers');
const { protect } = require('../Middlewares/authMiddleware')
//const authUser = require('../Controllers/userControllers');
const router = express.Router();

router.route('/').post(register).get(protect, allUsers);

router.route('/login').post(authUser);

module.exports = router;
