const signToken = require("./signToken");
import { Response } from 'express';

require("dotenv").config();
let appName="App-"
appName+= process.env.APPNAME

  module.exports = (res: Response, payloadInfo: userData) => {
    //console.log('userData', signToken(payloadInfo))
    res.cookie(appName, signToken(payloadInfo),{
        maxAge: 43200000,
        httpOnly: true,
        secure: false
    }).send("Cookie sent")
  };