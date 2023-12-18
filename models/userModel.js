const mongoose = require('mongoose');
const plm = require('passport-local-mongoose');



const userModel = mongoose.Schema({
    email: String,
    username: String,
    password: String,
    resetPasswordOtp: Number,
    expenses: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'expense',
        }
    ]
})

userModel.plugin(plm);


module.exports = mongoose.model('user', userModel);