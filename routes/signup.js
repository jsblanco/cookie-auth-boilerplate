"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const router = express.Router();
const checkError = require("./../helpers/checkUser");
const signupController = require("./../controllers/signupController");
router.post("/", checkError(), signupController.signup);
module.exports = router;
