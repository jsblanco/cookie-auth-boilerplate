const User = require("./../models/user");
const bcryptjs = require("bcryptjs");
import { Request, Response } from "express";
const { validationResult } = require("express-validator");
const sendCookie = require("./../helpers/sendCookie");

exports.signup = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { username, password } = req.body;
  const email = req.body.email.toLowerCase()
  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: "Email is already in the database" });
    }
    user = await User.findOne({ username });
    if (user) {
      return res
        .status(400)
        .json({ msg: "username is already in the database" });
    }
    user = { username, email, password }
    user.password = bcryptjs.hashSync(password, 10);
    const createdUser = await User.collection.insertOne({
      ...user,
      created_at: Date.now(),
      updated_at: Date.now(),
    });
    sendCookie(res, createdUser.ops[0])
  } catch (e) {
    res.status(400).send("An error ocurred");
  }
};
