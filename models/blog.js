const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({

title :{
    type: String,
    required: true,
    unique : true,
},
content :{
    type :String,
    required: true,
},
coverImage :{
    type :String,
    required: true,
    default :  '/images/default.svg',
},
createdBy :{
    type : mongoose.Schema.Types.ObjectId,
    ref : 'user',
},


},{timestamps : true});

const blog =mongoose.model('blog' ,blogSchema);
module.exports = blog;