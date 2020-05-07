const mongoose = require("mongoose");

const defaultConfig= {
    type: String,
    required: true,
    trim: true,
    unique: true
}

const userSchema = mongoose.Schema({
    username:{...defaultConfig, unique: true},
    email: {...defaultConfig, unique: true},
    password: defaultConfig,
}, {
    timestamps: true
})


module.exports = mongoose.model("User", userSchema)