
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken')

let taskSchema = new mongoose.Schema({
    description:{
        type:String,
        required:true
    },
    completed:{
        type:Boolean,
        default:false
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"user"
    }
},{
    timestamps:true
})

 
 
 
 
const task = mongoose.model('task', taskSchema)
module.exports = task