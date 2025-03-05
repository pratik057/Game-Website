const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: 
  {
    type: String,
    required: true,
    min: 3,
    max: 20,
    unique: true
  },
  password: {
    type: String,
    min: 6,
    required: true
  },
  email:{
    type: String,
    required: true,
    max: 50,
    unique: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  role: {
    type: String,
    default: 'user'
    
  }
});
const User = mongoose.model('User', userSchema);
module.exports = User;