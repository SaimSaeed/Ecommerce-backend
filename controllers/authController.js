import asyncHandler from "../middleware/asyncHandler.js";
import User from "../model/User.js"
// import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

// Login
const Login = asyncHandler(async (req, res) => {
  const user = await User.findOne({ username: req.body.username })
  if (!user) {
    res.status(401)
    throw new Error("Wrong Credentials!")

  }
  if (!(await user.matchPassword(req.body.password))) {
    res.status(401)
    throw new Error("Wrong Credentials")
  }
  const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "30d"
  })

  //  set Jwt as an http only cookie
  res.cookie("jwt", accessToken, {
    httpOnly: true,
    // secure: process.env.NODE_ENV !== "development",
    secure: true,
    sameSite: "strict",
    maxAge: 30 * 24 * 60 * 60 * 1000 //30days

  }
  )

  return res.status(200).json({
    id: user._id,
    username: user.username,
    email: user.email,
    isAdmin: user.isAdmin
  })

})

// Register
const Register = asyncHandler(async (req, res) => {
  const existingUser = await User.findOne({
    username: req.body.username
  })
  if (existingUser) {
    res.status(401)
    throw new Error("User is Already Registered!")
  }
  const user = new User({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password
  })

  const saveUser = await user.save()
  if(saveUser){
    const accessToken = jwt.sign({ id: saveUser._id }, process.env.JWT_SECRET, {
      expiresIn: "30d"
    })
  
    //  set Jwt as an http only cookie
    res.cookie("jwt", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 30 * 24 * 60 * 60 * 1000 //30days
  
    })
    return res.status(200).json({
      id: saveUser._id,
      username: saveUser.username,
      email: saveUser.email,
      isAdmin: saveUser.isAdmin
    })
  }
  else{
    res.status(400)
    throw new Error("Invalid User Data!")
  }
})

// Logout
const Logout = asyncHandler(async (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0)
  })
  res.status(200).json({ message: "Logged Out!" })
})
// Get the Logged User Profile
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)
  if (user) {
    res.status(200).json({
      id: user._id,
      username: user.username,
      email: user.email,
      isAdmin: user.isAdmin
    })
  }
  else {
    res.status(404)
    throw new Error("User Not Found!")
  }

})
// Update the logged user profile
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)
  if (user) {
    user.username = req.body.username || user.username;
    user.email = req.body.email || user.email;
    if (req.body.password) {
      user.password = req.body.password
    }

    const updatedUser = await user.save()
    return res.status(200).json({
      id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin

    })

  } else {
    res.status(404)
    throw new Error("User Not Found!")
  }
})
// Get all user for admin
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find()
  res.status(200).json(users)
})

// Get User by Id for admin
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password")
  if(user){
    res.status(200).json(user)
  }else{
    res.status(404)
    throw new Error("No User Found!")
  }
})

// Delete user for admin
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)
  if(user){
    if(user.isAdmin){
      res.status(400)
      throw new Error("Cannot Delete Admin!")
    }
    await User.deleteOne({_id:user._id})
    res.status(200).json("User Deleted!")
  }else{
    res.status(404)
    throw new Error("User Not Found!")
  }
})


// update User by Id for admin
const updateUserById = asyncHandler(async (req, res) => {
 const user = await User.findById(req.params.id)
 if(user){
  user.username = req.body.username || user.username;
  user.email = req.body.email || user.email;
  user.isAdmin = Boolean(req.body.isAdmin) ;

  const updatedUser = await user.save()
  res.status(200).json({
    _id:updatedUser._id,
    username:updatedUser.username,
    email:updatedUser.email,
    isAdmin:updatedUser.isAdmin
  })
 }else{
  res.status(404)
  throw new Error("User Not Found!")
 }
})

export { Login, Register, Logout, getUserProfile, updateUserProfile, getUsers, deleteUser, getUserById, updateUserById }





