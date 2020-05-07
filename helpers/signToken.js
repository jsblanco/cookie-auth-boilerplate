"use strict";
const jwt = require("jsonwebtoken");
module.exports = (userData) => {
    const payload = {
        id: userData._id,
        username: userData.username,
        email: userData.email,
    };
    return jwt.sign(payload, process.env.SECRETKEY, {
        expiresIn: 31536000,
    });
};
