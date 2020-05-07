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
const User = require("./../models/user");
const bcryptjs = require("bcryptjs");
const { validationResult } = require("express-validator");
const signToken = require("./../helpers/signToken");
const sendCookie = require("./../helpers/sendCookie");
exports.signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { username, password } = req.body;
    const email = req.body.email.toLowerCase();
    try {
        let user = yield User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: "Email is already in the database" });
        }
        user = yield User.findOne({ username });
        if (user) {
            return res
                .status(400)
                .json({ msg: "username is already in the database" });
        }
        user = { username, email, password };
        user.password = bcryptjs.hashSync(password, 10);
        const createdUser = yield User.collection.insertOne(Object.assign(Object.assign({}, user), { created_at: Date.now(), updated_at: Date.now() }));
        sendCookie(res, createdUser.ops[0]);
    }
    catch (e) {
        res.status(400).send("An error ocurred");
    }
});
