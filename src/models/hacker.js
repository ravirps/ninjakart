
const mongoose = require('mongoose'); 
const validator = require('validator');

const hacker =mongoose.model('hacker',{
    name:
    {
        type:String,
        required:true
    },
    profileLink:{
        type:String,
        trim:true,
        
        validate(value){
            if(!validator.isURL(value))
            {
                throw new Error("not valid proflieLink")
            }
        }
    },
    solved:{
        type:Number,
        default:0
    },
    attempted:{
        type:Number,
        default:0
    },
    submitted:{
        type:Number,
        default:0
    }


})
module.exports=hacker