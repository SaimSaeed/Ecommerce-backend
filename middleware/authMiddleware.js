import jwt from "jsonwebtoken"
import asyncHandler from "./asyncHandler.js"
import User from "../model/User.js"


// Protect Routes
const protect = asyncHandler(async (req,res,next)=>{
let token;
// Read the jwt from cookie
token = req.cookies.jwt
if(token){
try {
    const decode = jwt.verify(token,process.env.JWT_SECRET) 
    // This user object will be the request object on all of our routes
    req.user = await User.findById(decode.id).select("-password")
    next()
} catch (error) {
    console.log(error)
    res.status(401)
    throw new Error("Not Authorized, Invalid Token!")
}
}else{
    res.status(401)
    throw new Error("Not Authorized, No Token!")
}
})



// Admin Middleware
const admin = (req,res,next)=>{
    // requesting user from middleware and checking if isAdmin is true 
    // if the condition is true admin access will be granted otherwise not authorized
  if(req.user && req.user.isAdmin){
    next()
  }
  else{
    res.status(401)
    throw new Error("Not Authorized as Admin!")
  }
}


export {protect,admin}