"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jwt = require("jsonwebtoken");
module.exports = (req, res, next) => {
    let appName = "App-" + process.env.APPNAME;
    const token = req.cookies[appName];
    if (!req.cookies[appName]) {
        return res.status(401).json({ msg: "Unauthorized" });
    }
    try {
        const signature = jwt.verify(token, process.env.SECRETKEY);
        req.body.token = signature;
        next();
    }
    catch (e) {
        res.status(401).json({ msg: "Invalid token" });
    }
};
