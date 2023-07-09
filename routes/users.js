const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs');

const config = require('../config/database');
const User = require('../models/user');
const Post = require("../models/post");
const Comment = require("../models/comment");


// Register
router.post('/register', (req, res, next)=>{
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


// Authenticate (login)
router.post('/authenticate', (req, res, next)=>{
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
});


// Post
router.post('/post', passport.authenticate('jwt', {session:false}), (req, res, next)=>{
  Post.create({
    username:req.body.username,
    subject:req.body.subject,
    content:req.body.content,
  }).then(result =>{
      res.json({success:true, msg:"Post added"})
  });
});


// Display Posts
router.get('/post', (req, res, next)=>{
  Post.find({}, (err, posts) =>{
    if(err) return next(err);
    res.json({post:posts});
  })
});


// Add comment
router.post('/comment', passport.authenticate('jwt', {session:false}), (req, res, next)=>{
  Post.findOne({subject: req.body.subject}, (err, post) => {
    if(err) {
      throw err
    };
    if(!post){
      return res.json({success:false, msg:"Post not found"})
    } else{
      Comment.create({
        username:req.body.username,
        subject:req.body.subject,
        subSubject:req.body.subSubject,
        content:req.body.content,
      }).then(result =>{
          res.json({success:true, msg:"Comment added"})
      });
    }
  });
});


// Display Post and it's comments
router.get('/post/:subject', (req, res, next)=>{
  const subject =req.params.subject.trim()
  Post.findOne({subject: subject}, (err, post) =>{
    if(err) return next(err);
    if(post){
      Comment.find({subject: subject}, (err, comment)=>{
        if(err) return next(err);
        res.json({post:post, comments: comment});
      })
    } else{
      res.json({msg: "Something went wrong while searhing content"});
    }
  })
});



module.exports = router;