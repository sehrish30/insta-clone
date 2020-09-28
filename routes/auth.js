const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = mongoose.model("User");
const bcrypt = require('bcryptjs');
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const {JWT_SECRET} = require("../config/keys.js")
const nodemailer = require("nodemailer");
var sendinBlue = require('nodemailer-sendinblue-transport');
// const sendgrid = require("nodemailer-sendgrid-transport");
const {SENDINBLUE_USER, SENDINBLUE_PW, SENDINBLUE_API, URL} = require('../config/keys')


// router.get('/', (req, res)=>{
//     res.send("Hello");
// })

// router.get('/protected',requireLogin, (req, res)=> {
//     res.send("hello user");
// })

const transporter = nodemailer.createTransport({
    service: 'SendinBlue', // no need to set host or port etc.
    auth: {
        user: SENDINBLUE_USER,
        pass: SENDINBLUE_PW,
        api: SENDINBLUE_API
    }
});

router.post('/signup', (req,res) => {
    const {name, email, password, dp} = req.body;
    if(!email || !password || !name){
        res.status(422).json({error: "Please add all the fields"})
    }
    User.findOne({email: email})
       .then((savedUser)=> {
           if(savedUser){
             return res.status(422).json({error: "User already exists with that email"});
           }
           bcrypt.hash(password, 12)
            .then(hashedpassword => {
                const user = new User({
                    email,
                    password: hashedpassword,
                    name,
                    dp
                })
                user.save()
                .then(user => {
                    
                    transporter.sendMail({
                        to: user.email,
                        from: 'sehrishwaheed98@gmail.com',
                        subject: 'Welcome to Instagram Clone',
                        html: `<h1>Successfully Signed up in Instagram Clone.</h1><h5>If this was not you kindly ignore</h5>`
                    })
                    .then((res) => console.log("Successfully sent"))
                    .catch((err) => console.log("Failed ", err))

                    console.log(user.email);
                          

                   res.json({message: "Saved successfully"})
                })
                .catch(err => {
                    console.log(err);
                })
            })
          
       })
       .catch(err => {
           console.log(err);
       })    
})

router.post('/signin', (req,res) => {
    const {email, password} = req.body;
    if(!email || !password){
        res.status(422).json({error: "please add email and password"});
    }

    User.findOne({email:email})
      .then(savedUser => {
          if(!savedUser){
             return res.status(422).json({error: "Invalid email or password"})
          }
          bcrypt.compare(password, savedUser.password)
            .then(doMatch => {
                if(doMatch){
                    const token = jwt.sign({_id: savedUser._id}, JWT_SECRET);
                    const {_id, name, email, followers, following, dp} = savedUser
                    res.json({token, user: {_id, name, email, followers, following, dp}});
                    // res.json({message: "successfully signed in"})
                }else{
                    return res.status(422).json({error: "Invalid email or password"})
                }
            })
      })
       .catch(err => {
           console.log(err);
       })
})


router.post('/reset-password', (req, res)=> {
    crypto.randomBytes(32, (err, buffer)=> {
        if(err){
            console.log(err);
        }
    const token = buffer.toString("hex");
    User.findOne({email: req.body.email})
     .then(user => {
         if(!user){
             return res.status(422).json({error: "Email doesnot exist"})
         }
         user.resetToken = token
         user.expireToken = Date.now() + 3600000 // token valid for 1hr
         user.save().then((result) =>{
             transporter.sendMail({
                to: user.email,
                from: 'sehrishwaheed98@gmail.com',
                subject: 'Instagram Clone',
                html: `
                    <p>You requested for password reset</p>  
                    <h3>Click on this link <a href="${URL}/reset/${token}">RESET PASSWORD</a> to reset password</h3>   
                    `
         }).then((res) => console.log("Successfully sent"))
           .catch((err) => console.log("Failed ", err))
           
         res.json({message: "Please Check you email!"})
     })
    })
  })
})

router.post('/new-password', (req, res)=>{
    const newPassword = req.body.password;
    const sentToken = req.body.token;
    User.findOne({resetToken: sentToken, expireToken: {$gt: Date.now()}})
      .then(user => {
          if(!user){
              return res.status(422).json({error: "Try again session expired"})
          }
          bcrypt.hash(newPassword, 12).then(hashedpassword => {
              user.password = hashedpassword
              user.resetToken= undefined
              user.expireToken = undefined
              user.save().then((savedUser)=>{
                  res.json({message: "Password updated successfully"})
              })
          })
      }).catch(err => {
          console.log(err);
      })
})



module.exports = router