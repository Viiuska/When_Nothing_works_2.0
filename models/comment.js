const mongoose = require('mongoose');

const Schema = mongoose.Schema
let CommentSchema = new Schema({
    username:{
        type:String,
        required:true
    },
    subject:{
        type:String,
        required:true
    },
    subSubject:{
        type:String,
    },
    content:{
        type:String,
        required:true
    }
});

module.exports=mongoose.model('Comment', CommentSchema)