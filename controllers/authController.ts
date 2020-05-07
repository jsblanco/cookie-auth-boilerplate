const User = require("../models/user");
const bcryptjs = require("bcryptjs");
import { Request, Response } from "express";
const { validationResult } = require("express-validator");
const sendCookie = require("./../helpers/sendCookie");
let appName = "App-";
appName += process.env.APPNAME;

exports.login = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { password } = req.body;
  const email = req.body.email.toLowerCase();

  try {
    let userInDb = await User.findOne({ email });
    if (!userInDb)
      return res.status(400).json({ msg: "Email or password not valid" });
    const checkPassword = bcryptjs.compareSync(password, userInDb.password);
    if (!checkPassword)
      return res.status(400).json({ msg: "Email or password not valid" });
    sendCookie(res, userInDb);
  } catch (e) {
    res.status(400).send("An error ocurred");
  }
};

exports.me = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const user = await User.findOne({ email: req.body.token.email }).select(
      "-password"
    );

    sendCookie(res, {id: user._id, username: user.username, email: user.email});
  } catch (e) {
    console.error(e);
    res.status(500).json({ msg: "Server error" });
  }
};

exports.edit = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { username, email, password } = req.body;
  let { oldPassword } = req.body;
  const { id } = req.body.token;
  try {
    if (email !== req.body.token.email) {
      const checkEmail = await User.findOne({ email });
      if (checkEmail) return res.status(400).json({ msg: "Email not valid" });
    }
    if (!oldPassword) oldPassword = password;
    const userData = await User.findById(id);
    const checkPassword = await bcryptjs.compare(
      oldPassword,
      userData.password
    );
    if (!checkPassword)
      return res.status(400).json({ msg: "Password incorrect" });

    const salt = await bcryptjs.genSalt(10);
    const hashPassword = await bcryptjs.hash(password, salt);
    await User.findByIdAndUpdate(id, {
      username,
      email,
      password: hashPassword,
    });

    sendCookie(res, { _id: id, username, email });
  } catch (e) {
    console.error(e);
    res.status(500).json({ msg: "Server error" });
  }
};

exports.delete = async (req: Request, res: Response) => {
  const { id } = req.body.token;
  try {
    const userData = await User.findById(id);
    if (!req.body.password)
      return res.status(400).json({ msg: "Password empty" });
    const checkPassword = await bcryptjs.compare(
      req.body.password,
      userData.password
    );
    if (!checkPassword)
      return res.status(400).json({ msg: "Password incorrect" });
    await User.findByIdAndRemove(id);
    res.clearCookie(appName)
    res.json({ msg: "User deleted" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ msg: "Server error" });
  }
};
