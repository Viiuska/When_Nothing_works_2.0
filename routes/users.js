const express = require('express');
const router = express.Router()
const passport = require('passport')
const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs');


// Register
router.get('register', (req, res, next)=>{
    res.send('Register');
});


// Authenticate
router.get('authentivate', (req, res, next)=>{
    res.send('Authenticate');
});


// Profile
router.get('profile', (req, res, next)=>{
    res.send('Profile');
});


module.exports = router;