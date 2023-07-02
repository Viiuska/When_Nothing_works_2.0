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
    }
});

module.exports=mongoose.model('Post', PostSchema)