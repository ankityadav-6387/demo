var express = require('express');
var router = express.Router();
const nodemailer = require('nodemailer');
const User = require('../models/userModel');
const expense = require('../models/expenseModel');
const passport = require("passport");
const LocalStrategy = require("passport-local");
passport.use(new LocalStrategy(User.authenticate()));


/* GET home page. */
router.get('/', function (req, res) {
  res.render('index');
});
router.get('/signin', function (req, res) {
  res.render('signin.ejs', {
    err: req.flash().error,
  });
});
router.get('/profile', function (req, res) {
  res.render('profile.ejs');
});
router.get('/forget', function (req, res) {
  res.render('forget.ejs');
});
router.get('/addexpense', (req, res) => {
  res.render('Add.ejs');
})

router.post('/add-expense', async (req, res) => {
  try {
    const Expense = new expense(req.body);
    req.user.expenses.push(Expense._id);
    Expense.user = req.user._id;
    await Expense.save();
    await req.user.save();
    res.redirect('/profile');
  } catch (error) {
    res.send(error);
  }
})

router.post('/forget', async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.send("User Not Found");
    }
    const otp = Math.floor(1000 + Math.random() * 9000);
    user.resetPasswordOtp = otp;
    await user.save();
    await sendMailhandler(req.body.email, otp, res);
    res.render('otpvalidation.ejs', {
      id: user._id,
    })

  } catch (error) {
    res.send(error);
  }
})

//sendMailHandler Function
async function sendMailhandler(email, otp, res) {
  const transport = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 465,
    auth: {
      user: `ankitghaghri@gmail.com`,
      pass: 'xubl fqcn hahx vlov',
    },
  });
  // receiver mailing info
  const mailOptions = {
    from: "Ankit Pvt. Ltd.<ankitghaghri@gmail.com>",
    to: email,
    subject: "OTP Testing Mail Service",
    // text: req.body.message,
    html: `<h1>${otp}</h1>`,
  };
  // actual object which intregrate all info and send mail
  transport.sendMail(mailOptions, (err, info) => {
    if (err) {
      return res.send(err)
    }
    // console.log(info);
    return;
  });
}

//OTP Check 
router.post('/otp/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    // console.log(user);
    if (user.resetPasswordOtp == req.body.otp) {
      res.render('newPassword.ejs', { id: user._id });
      return;
    }
    res.send('OTP not match');
  } catch (error) {
    res.send(error);
  }
})


//Re-Password Generate
router.post('/change-password/:id', async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    const newPassword = req.body.newpassword;
    // user.password = newPassword;
    await user.setPassword(newPassword);
    await user.save();
    res.redirect('/signin');
  } catch (error) {
    res.send(error);
  }
})


router.post('/signup', async (req, res) => {
  try {
    await User.register(
      { username: req.body.username, email: req.body.email },
      req.body.password
    );
    res.redirect("/signin");
  } catch (error) {
    console.log(error);
    res.send(error);
  }
})

//singin route
router.post('/signin', passport.authenticate("local", {
  successRedirect: "/profile",
  failureRedirect: "/signin",
  failureFlash: true,
}),
  function (req, res, next) { }
);

module.exports = router;
