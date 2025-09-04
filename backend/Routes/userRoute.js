const express = require('express');
const {register, login, logout, toSeller, user, toCourier, toWAREHOUSE} = require("../Controllers/userController.js");
const verifyToken = require('../Middlewares/verifyToken.js');

const router = express.Router();
//auth
router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);


router.patch("/seller", verifyToken, toSeller)
router.patch("/courier", verifyToken, toCourier)
router.patch("/warehouse", verifyToken, toWAREHOUSE)
router.get("/user-profile",verifyToken, user)

module.exports = router;