const express = require('express');
const router = express.Router()
const passport = require('passport')
const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs');

const User = require('../models/user')
const config = require('../config/database');


// Register
router.post('register', (req, res, next)=>{
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(req.body.password, salt, (err, hash) => {
            if(err){res.json({success:false, msg:"Failed to register"})}
            User.create({
                name:req.body.name,
                email:req.body.email,
                username:req.body.username,
                password:hash
            }
            ).then(result =>{
                res.json({success:true, msg:"User registered"})
            })
        })

    });

});


// Authenticate
router.post('authentivate', (req, res, next)=>{
    User.findOne({username: req.body.username}, (err, user) => {
        if(err) {
          throw err
        };
        if(!user){
          return res.json({success:false, msg:"User not found"})
        }
        else{
          bcrypt.compare(req.body.password, user.password, (err, isMatch) => {
              if(err) throw err
              if(isMatch) {
                const token = jwt.sign({user}, config.secret,{  //user needs {} because the way we sign our token
                  expiresIn:604800  //week
                })
                res.json({
                  success:true, 
                  token: 'JWT '+ token,
                  user:{
                    id:user._id,
                    name:user.name,
                    username:user.username,
                    email:user.email
                  }
                })
              }else{
                return res.json({success:false, msg:"Wrong password or username"})
              }
            })
        }
    })
});


// Profile
router.get('/profile', passport.authenticate('jwt', {session:false}), (req, res, next)=>{
    res.json({user:req.user});
})


module.exports = router;