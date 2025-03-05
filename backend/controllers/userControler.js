const User = require('../models/User');
const router = require('express').Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');    
exports.registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
   if(!username || !email || !password) {
     return res.status(400).json({message: "Please fill in all fields"});
   }
    const user = await User.findOne({email});
    if(user) {
      return res.status(400).json({message: "User already exists"});
    }
else{
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = new User({
            username: username,
            email: email,
            password: hashedPassword
        });
        const savedUser = await newUser.save();
        console.log("User saved:", savedUser); // Debugging log
        res.status(201).json(savedUser);
}
  }catch (err) {
    res.status(500).json(err);
  }
}
exports.loginUser = async (req, res) => {
    try {
       const { email, password } = req.body;
         if(!email || !password) {
            return res.status(400).json({message: "Please fill in all fields"});
         }
         const user = await User.findOne({email});
            if(!user) {
                return res.status(400).json({message: "User does not exist"});
            }
            else{
                const validPassword = await bcrypt.compare(password, user.password);
                if(!validPassword) {
                    return res.status(400).json({message: "Invalid password"});
                }
                else{
                    const token = jwt.sign({id: user._id}, process.env.JWT_SECRET);
                    res.status(200).json({token, user: {id: user._id, username: user.username, email: user.email}});
                }
            }
    } catch (err) {
        res.status(500).json(err);
    }
}
