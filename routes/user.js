const express = require("express");

const { setuser } = require("../service");
const router = express.Router();
const User = require("../models/user");

// sign up route
router.post("/", async (req, res) => {
  console.log("sign up from data : ", req.body);
  const { username, email, password } = req.body;

  await User.create({
    username,
    email,
    password,
  });

  res.redirect("/login");
});
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  console.log(req.body);
  
   try {
     const token  = await User.matchPassword(email, password);
     return res.cookie('token' , token).redirect("/");
    
   } catch (error) {
     return res.render('login' ,{
     error :"Incorrect email and password!",
     })
   }
});
router.get('/logout' , (req ,res) =>{
 res.clearCookie('token').redirect('/');
})
module.exports = router;
