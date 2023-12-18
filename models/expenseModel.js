const mongoose = require('mongoose');

const expenseSchema = mongoose.Schema({
    category: String,
    amount: Number,
    description: String,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'user',
    }
})



module.exports = mongoose.model('expense', expenseSchema);