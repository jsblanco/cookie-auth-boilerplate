require("dotenv").config();
const express = require("express");
const cors = require("cors");
const port = process.env.PORT;
const cookieparser = require("cookie-parser")
import {connectDB} from './config/db.config';

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
connectDB();
app.use(cookieparser())
app.use("/api/signup", require("./routes/signup"));
app.use("/api/auth", require("./routes/auth"));

app.listen(port, "0.0.0.0", ()=>{
    console.log(`App running on port ${port}`)
})



module.exports = app;