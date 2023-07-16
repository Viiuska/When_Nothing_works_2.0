const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs');
const moment = require('moment');

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
                password:hash,
                joined:moment().format('DD/MM/YYYY'),
                bio:""
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

// Edit profile bio
router.post('/profile/edit', (req, res, next)=>{
  User.findOne({username:req.body.username}, (err, user)=>{
    if(err) {
      throw err
    };
    if(!user){
      return res.json({success:false, msg:"User not found"})
    } else {
      user.bio = req.body.bio
      user.save((err)=>{
        if(err)return next(err)
        res.json({success:true, user:user});
      })
    }
  })
});


// View other profiles
router.get('/profile/:username', (req, res, next)=>{
  User.findOne({username:req.params.username}, (err, user)=>{
    if(err) {
      throw err
    };
    if(!user){
      return res.json({success:false, msg:"User not found"})
    } if(user) {
      res.json({user:user});
    } else{
      res.json({success:false, msg:"User not found"})
    }
  })
});

// Liked comments/posts
router.post('/thumbsup',passport.authenticate('jwt', {session:false}), (req, res, next)=>{
  User.findOne({username: req.body.username}, (err, user)=>{
    if(err) {
      throw err
    };
    if(!user){
      return res.json({success:false, msg:"User not found"})
    } else{
      User.findOne({likedId:req.body.id}, (err, liked)=>{
        let userLike=user.likedId
        if(err) {
          throw err
        };
        if(liked){
          Post.findOne({_id: req.body.id}, (err, post)=>{
            if(err) {
              throw err
            };
            if(!post){
              Comment.findOne({_id:req.body.id}, (err, comment)=>{
                if(err) {
                  throw err
                };
                if(!comment){
                  return res.json({success:false, msg:"Comment not found"})
                } else{
                  comment.likeCount -= 1;
                  comment.save((err)=>{
                    if(err)return next(err)
                  })
                  userLike.pull(req.body.id);
                  user.save((err)=>{
                    if(err)return next(err)
                    res.json({success:true, msg:"Like removed comment (user)"})
                  })

                }
              })
            } if(post){
            post.likeCount -= 1;
            post.save((err)=>{
              if(err)return next(err)
            })
            userLike.pull(req.body.id);
            user.save((err)=>{
              if(err)return next(err)
              res.json({success:true, msg:"Like removed post"})
            })
          }
          })
        } else{
          Post.findOne({_id: req.body.id}, (err, post)=>{
            if(err) {
              throw err
            };
            if(!post){
              Comment.findOne({_id:req.body.id}, (err, comment)=>{
                if(err) {
                  throw err
                };
                if(!comment){
                  return res.json({success:false, msg:"Comment not found"})
                } else{
                  comment.likeCount += 1;
                  comment.save((err)=>{
                    if(err)return next(err)
                  })
                  userLike.push(req.body.id);
                  user.save((err)=>{
                    if(err)return next(err)
                    res.json({success:true, msg:"Like added comment"})
                  })
                }
              })
            } if(post){
            post.likeCount += 1;
            post.save((err)=>{
              if(err)return next(err)
            })
            userLike.push(req.body.id);
            user.save((err)=>{
              if(err)return next(err)
              res.json({success:true, msg:"Like added post"})
            })
          }
          })
        }
        
      })
      
    }
  })
})

// Post
router.post('/post', passport.authenticate('jwt', {session:false}), (req, res, next)=>{
  let time = moment().format('HH:mm DD/MM/YYYY');
  Post.create({
    username:req.body.username,
    subject:req.body.subject,
    content:req.body.content,
    timestamp:time,
    likeCount:0,
    commentCount:0
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

router.post('/post/ids', (req, res, next)=>{
  const idsArr =req.body.id
  Post.find({_id: idsArr.split(',') }, (err, posts) =>{
    if(err) return next(err);
    if(posts){
      res.json({post:posts});
    } else{
      res.json({msg: "Something went wrong while searhing content"});
    }
  })
})

// Add comment
router.post('/comment', passport.authenticate('jwt', {session:false}), (req, res, next)=>{
  Post.findOne({_id: req.body.postId}, (err, post) => {
    if(err) {
      throw err
    };
    if(!post){
      return res.json({success:false, msg:"Post not found"})
    } else{
      let time = moment().format('HH:mm DD/MM/YYYY');
      Comment.create({
        username:req.body.username,
        postId:req.body.postId,
        subSubject:req.body.subSubject,
        content:req.body.content,
        likeCount:0,
        timestamp:time
      }).then(result =>{
          post.commentCount += 1;
          post.save((err)=>{
            if(err)return next(err)
            res.json({success:true, msg:"Comment added"})
          })
        });
    }
  });
});


// Display Post and it's comments
router.get('/post/:postId', (req, res, next)=>{
  const postId = req.params.postId;
  Post.findOne({_id: postId}, (err, post) =>{
    if(err) return next(err);
    if(post){
      Comment.find({postId: postId}, (err, comment)=>{
        if(err) return next(err);
        res.json({post:post, comments: comment});
      })
    } else{
      res.json({msg: "Something went wrong while searhing content"});
    }
  })
});

// Search Content
router.get('/:search', (req, res, next)=>{
  Post.find({
    $or:[
      {subject:{$regex: new RegExp(req.params.search, 'i')}},
      {content:{$regex: new RegExp(req.params.search, 'i')}}
    ],
  },
  '_id', (err, searchResult)=>{
    if(err){
      return res.json({success:false, msg:"Error searching posts"})
    }
    const postIds = searchResult.map((post)=> post._id);
    return res.json({success:true, contentId:postIds})
  }
  );
});

module.exports = router;