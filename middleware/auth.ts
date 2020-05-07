const jwt  = require("jsonwebtoken");
import { Request, Response, NextFunction } from 'express';
type tokenReq = Request & {email: string}

module.exports = (req : tokenReq, res : Response, next: NextFunction) => {
    let appName="App-"+process.env.APPNAME

    const token = req.cookies[appName];
    
    if (!req.cookies[appName]) {
        return res.status(401).json({msg: "Unauthorized"})
    }
    try {
        const signature = jwt.verify(token, process.env.SECRETKEY);
        req.body.token = signature;
        next()
    } catch (e) {
        res.status(401).json({msg: "Invalid token"})
    }
}