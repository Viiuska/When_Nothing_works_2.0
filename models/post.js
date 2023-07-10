const mongoose = require('mongoose');

const Schema = mongoose.Schema
let PostSchema = new Schema({
    username:{
        type:String,
        required:true
    },
    subject:{
        type:String,
        required:true
    },
    content:{
        type:String,
        required:true
    },
    timestamp:{
        type:Date
    },
    timestamp:{
        type:String
    },
    commentCount:{
        type:Number,
        default:0
    }
});

module.exports=mongoose.model('Post', PostSchema)