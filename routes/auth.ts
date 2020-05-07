export {};
const express = require("express");
const router = express.Router();
const authController = require("./../controllers/authController");
const auth = require("./../middleware/auth");
const checkError = require("./../helpers/checkUser");

router.post("/", authController.login);

router.get("/", auth, authController.me);

router.put("/", checkError(), auth, authController.edit);

router.delete("/", auth, authController.delete);

module.exports = router;
