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
    },
    likeCount:{
        type:Number,
        default:0
    }
});

module.exports=mongoose.model('Comment', CommentSchema)