let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let userScheam = mongoose.Schema({
  userName: String,
  password: String,
  mobileNo: Number
})

let User = new mongoose.model('usersConswd', userScheam);
module.exports  = User;