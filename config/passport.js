const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../models/user');
const config = require('../config/database');

module.exports = function(passport){
    let opts = {};
    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme("jwt")
    opts.secretOrKey = config.secret;
    passport.use(new JwtStrategy(opts, (jwt_payload, done)=>{
        User.findById(jwt_payload.user._id, (err, user)=>{
            if(err){
                return done(err, false)
            }
            if(user){
                return done(null, user) //true to user so we get the json object 
            }
            else{
                return done (null, false)
            }
        })
    }))
}