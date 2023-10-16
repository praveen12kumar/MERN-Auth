import  jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";

//protect routes is usefull when we want that some routes are to be
// accessible when token is available.

const protect = asyncHandler(async(req, res, next)=>{
    let token;

    token = req.cookies.jwt;
    console.log("token",token);
    if(token){
        try{
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.userId).select('-password')
            next();
        }
        catch(e){
            res.status(401);  
            throw new Error(`Not authorized, invalid token`)
        }
    }
    else{
        res.status(401);
        throw new Error(`Not authorized, no token`)
    }
})

export {protect};