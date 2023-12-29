var express = require('express');
var router = express.Router();
const nodemailer = require('nodemailer');
const User = require("../models/userModel");
const passport = require("passport");
const LocalStrategy = require("passport-local");
passport.use(new LocalStrategy(User.authenticate()));


/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('Authenticate/signin.ejs');
});
router.get('/signup', (req, res, next) => {
  res.render('Authenticate/signup.ejs');
})
router.get('/forget', (req, res) => {
  res.render('Authenticate/forget.ejs');
})

//signup route
router.post('/Authenticate/signup', async (req, res) => {
  try {
    await User.register(
      { username: req.body.username, email: req.body.email },
      req.body.password
    );
    res.redirect("/");
  } catch (error) {
    console.log(error);
    res.send(error);
  }
})
//singin route
router.post('/Authenticate/signin', passport.authenticate("local", {
  successRedirect: "/profile",
  failureRedirect: "/",
}),
  function (req, res, next) { }
);
//Send-mail route
router.post('/send-mail', async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.send("User Not Found");
    }
    const otp = Math.floor(1000 + Math.random() * 9000);
    user.resetPasswordOtp = otp;
    await user.save();
    await sendMailhandler(req.body.email, otp, res);
    res.render('Authenticate/otpValidation.ejs', {
      email: req.body.email,
      id: user._id,
      admin: req.user,
    });
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
      user: `sumonkhan1081@gmail.com`,
      pass: process.env.PASSWORD,
    },
  });
  // receiver mailing info
  const mailOptions = {
    from: "Su Mon Pvt. Ltd.<sumonkhan1081@gmail.com>",
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
router.post('/Authenticate/OTP-match/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    // console.log(user);
    if (user.resetPasswordOtp == req.body.otp) {
      user.resetPasswordOtp = -1;
      await user.save();
      res.render('Authenticate/newPassword.ejs', { id: user._id });
      return;
    }
    res.send('OTP not match');
  } catch (error) {
    res.send(error);
  }
})
//Re-Password Generate
router.post('/Authenticate/change-password/:id', async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    const newPassword = req.body.password;
    // user.password = newPassword;
    await user.setPassword(newPassword);
    await user.save();
    res.redirect('/');
  } catch (error) {
    res.send(error);
  }
})

// AUTHENTICATED ROUTE MIDDLEWARE
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.redirect("/");
  }
}
// SIGNOUT CODE
router.get("/logout", isLoggedIn, function (req, res, next) {
  req.logout(() => {
    res.redirect("/");
  });
});



module.exports = router;