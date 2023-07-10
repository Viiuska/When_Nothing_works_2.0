const mongoose = require('mongoose');

const Schema = mongoose.Schema
let CommentSchema = new Schema({
    username:{
        type:String,
        required:true
    },
    postId:{
        type:String,
        required:true
    },
    subSubject:{
        type:String
    },
    content:{
        type:String,
        required:true
    },
    timestamp:{
        type:String
    }
});

module.exports=mongoose.model('Comment', CommentSchema)