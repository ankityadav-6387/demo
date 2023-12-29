
const mongoose = require('mongoose');
const plm = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
    username: String,
    email:String,
    password:String,
    resetPasswordOtp:String,
    expenses: [{ type: mongoose.Schema.Types.ObjectId, ref: "expense" }],
})

userSchema.plugin(plm);
module.exports = mongoose.model('user',userSchema);