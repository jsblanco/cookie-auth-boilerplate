"use strict";
const mongoose = require("mongoose");
const defaultConfig = {
    type: String,
    required: true,
    trim: true,
    unique: true
};
const userSchema = mongoose.Schema({
    username: Object.assign(Object.assign({}, defaultConfig), { unique: true }),
    email: Object.assign(Object.assign({}, defaultConfig), { unique: true }),
    password: defaultConfig,
}, {
    timestamps: true
});
module.exports = mongoose.model("User", userSchema);
