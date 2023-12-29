
const mongoose = require('mongoose');

const expenseModel = new mongoose.Schema(
    {
        category:String,
        description:String,
        amount:Number,
        user: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    },
    { timestamps: true },
);


module.exports = mongoose.model('expense',expenseModel);


