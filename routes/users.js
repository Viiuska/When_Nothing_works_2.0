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
    res.send('Authenticate');
});


// Profile
router.get('profile', (req, res, next)=>{
    res.send('Profile');
});


module.exports = router;