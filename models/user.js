const mongoose = require('mongoose');

const Schema = mongoose.Schema
let UserSchema = new Schema({
    name:{
        type:String
    },
    email:{
        type:String,
        required:true
    },
    username:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required: true
    },
    joined:{
        type:String
    },
    bio:{
        type:String
    },
    likedId:{
        type:[]
    }
});

module.exports=mongoose.model('User', UserSchema)