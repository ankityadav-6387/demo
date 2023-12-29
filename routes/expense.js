var express = require('express');
var router = express.Router();
const Expense = require('../models/expenseModel');
const User = require("../models/userModel");
const category = require('../public/javascripts/category');
const Razorpay = require('razorpay');




router.post('/create-expense', async (req, res) => {
    try {
        const expense = new Expense(req.body);
        req.user.expenses.push(expense._id);
        expense.user = req.user._id;
        // console.log(expense);
        // res.json(expense);
        await expense.save();
        await req.user.save();
        res.redirect("/profile");
    } catch (error) {
        res.send(error);
}
});
//
router.get('/profile', async (req, res) => {
    try {
      const user = await req.user.populate('expenses');
      // console.log(user.expenses);
      res.render('Expense/Profile.ejs', {
        category: category,
        expenses: user.expenses,
        admin: req.user 
      });
    } catch (error) {
         res.send(error);
    }
  })


  router.get('/delete/:id', async (req, res) => {
    try {
      // console.log( req.params.id);
      const expenseIndex = await req.user.expenses.findIndex((exp) => exp.valueOf() === req.params.id);
      console.log("expenseIndexx "+ expenseIndex);
      req.user.expenses.splice(expenseIndex, 1);
      await req.user.save();
      await Expense.findByIdAndDelete(req.params.id);
      res.redirect("/profile");
    } catch (error) {
      res.json(error);
    }
  })
  
  router.get('/update/:id', async (req, res) => {
    const expense = await Expense.findById(req.params.id);
    res.render('Expense/expenseUpdate.ejs', { admin: req.user, id: req.params.id, expense: expense,category:category });
  })
  router.post('/update/:id', async (req, res) => {
    try {
      await Expense.findByIdAndUpdate(req.params.id, req.body);
      res.redirect('/profile');
    } catch (error) {
      res.send(error);
    }
  })

  

module.exports = router;