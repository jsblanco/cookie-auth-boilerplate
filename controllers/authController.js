"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const User = require("../models/user");
const bcryptjs = require("bcryptjs");
const { validationResult } = require("express-validator");
const signToken = require("./../helpers/signToken");
const sendCookie = require("./../helpers/sendCookie");
let appName = "App-";
appName += process.env.APPNAME;
exports.login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { password } = req.body;
    const email = req.body.email.toLowerCase();
    try {
        let userInDb = yield User.findOne({ email });
        if (!userInDb)
            return res.status(400).json({ msg: "Email or password not valid" });
        const checkPassword = bcryptjs.compareSync(password, userInDb.password);
        if (!checkPassword)
            return res.status(400).json({ msg: "Email or password not valid" });
        sendCookie(res, userInDb);
    }
    catch (e) {
        res.status(400).send("An error ocurred");
    }
});
exports.me = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const user = yield User.findOne({ email: req.body.token.email }).select("-password");
        sendCookie(res, { id: user._id, username: user.username, email: user.email });
    }
    catch (e) {
        console.error(e);
        res.status(500).json({ msg: "Server error" });
    }
});
exports.edit = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { username, email, password } = req.body;
    let { oldPassword } = req.body;
    const { id } = req.body.token;
    try {
        if (email !== req.body.token.email) {
            const checkEmail = yield User.findOne({ email });
            if (checkEmail)
                return res.status(400).json({ msg: "Email not valid" });
        }
        if (!oldPassword)
            oldPassword = password;
        const userData = yield User.findById(id);
        const checkPassword = yield bcryptjs.compare(oldPassword, userData.password);
        if (!checkPassword)
            return res.status(400).json({ msg: "Password incorrect" });
        const salt = yield bcryptjs.genSalt(10);
        const hashPassword = yield bcryptjs.hash(password, salt);
        yield User.findByIdAndUpdate(id, {
            username,
            email,
            password: hashPassword,
        });
        sendCookie(res, { _id: id, username, email });
    }
    catch (e) {
        console.error(e);
        res.status(500).json({ msg: "Server error" });
    }
});
exports.delete = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.body.token;
    try {
        const userData = yield User.findById(id);
        if (!req.body.password)
            return res.status(400).json({ msg: "Password empty" });
        const checkPassword = yield bcryptjs.compare(req.body.password, userData.password);
        if (!checkPassword)
            return res.status(400).json({ msg: "Password incorrect" });
        yield User.findByIdAndRemove(id);
        res.clearCookie(appName);
        res.json({ msg: "User deleted" });
    }
    catch (e) {
        console.error(e);
        res.status(500).json({ msg: "Server error" });
    }
});
