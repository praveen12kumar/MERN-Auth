import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import bcrypt from 'bcrypt';
import generateToken from '../utils/generateToken.js';




//@desc Auth user/set token
//@url  POST/api/users/auth
//@access public
// login
const authUser = asyncHandler(async (req, res) => {
    const {email, password} = req.body;

    if(!email || !password){
        res.status(400);
        throw new Error('Please enter all required fields')
    }

    const user = await User.findOne({email});
    if(user && (await bcrypt.compare(password, user.password))){
        generateToken(res, user._id);
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
        })
    }
    else{
        res.status(401);
        throw new Error("Invalid email or password");
    }
});

//@desc register user
//@url  POST/api/users
//@access public

const registerUser = asyncHandler(async (req, res) => {
    const {name, email, password} = req.body;

    // check if we get name, email and password
    if(!name || !email || !password){
        res.status(400);
        throw new Error('Please enter all required fields')
    }

    //check if user already registered
    const userExist = await User.findOne({email});
    if(userExist) {
        res.status(400);
        throw new Error("User already registered");
    }

    // hassed the password
    const salt = await bcrypt.genSalt(10);
    const hassedPassword = await bcrypt.hash(password, salt);


    // create a new user
    const user = new User({
        name,
        email,
        password:hassedPassword
    });
    await user.save();
    console.log('New user created', user)

    if(user){
        generateToken(res, user._id);
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email
        })
    }
    else{
        res.status(400);
        throw new Error('Invalid user data');
    }
});

//@desc Logout user
//@url  POST/api/users/logout
//@access public

const logoutUser = asyncHandler(async (req, res) => {
    res.cookie('jwt', "",{
        httpOnly: true,
        expires: new Date(0),
    })
    res.status(201).json({message:"User logged out successfully"})
})

//@desc get the user profile
//@url  GET/api/users/profile
//@access private


const getUserProfile = asyncHandler(async(req, res)=>{
    const user = {
        _id: req.user._id,
        name:req.user.name,
        email:req.user.email
    }
    res.status(200).json({message:"User profile", user});
});




//@desc Update the user profile
//@url  PUT/api/users/prfile
//@access private

const updateUserProfile = asyncHandler(async(req, res)=>{
   const user = await User.findById(req.user._id);
   if(user){
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email

    if(req.body.password){
        user.password = req.body.password;
    }

    const updatedUser = await user.save();
    res.status(200).json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email
    });
   }
   else{
    res.status(404);
    throw new Error('User not found')
   }
})

export {
    authUser,
    registerUser,
    logoutUser,
    getUserProfile,
    updateUserProfile
};