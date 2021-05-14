
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken')
const task=require("./task")
let userSchema = new mongoose.Schema({
    name:
    {
        type: String,
        required: true
    },
    email:
    {
        unique: true,
        type: String,
        required: true
    },
    password: {
        type: String,
        trim: true,
        required: true
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    avatar:{
        type:Buffer
    }
}
,{
    timestamps:true
})

userSchema.pre('save', async function (next) {
    const user = this
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }

    next()
})

userSchema.pre('remove', async function (next) {
    const user = this
    await task.deleteMany({owner:user._id})
    next()
})
userSchema.methods.toJSON =  function () {
    const curr = this
    const curruser=curr.toObject()
    delete curruser.password
    delete curruser.tokens
    delete curruser.avatar
    return curruser
}
userSchema.virtual('tasks',{
    ref:"task",
    localField:"_id",
    foreignField:"owner"
})

userSchema.methods.getAuthToken = async function () {
    const curruser = this
    console.log("here i am")
    let token = jwt.sign({ _id: curruser._id.toString() }, "randomkeyword")
    curruser.tokens = curruser.tokens.concat({ token })
    console.log("token is ", token)
    await curruser.save()
    return token
}

userSchema.statics.findByCredential = async function (email, password) {
    console.log("finding by credentials ")
    try {
        const curr = await user.findOne({ email })
        if (!curr)
            throw new Error("unable to login")
        console.log(curr)

        if (await bcrypt.compare(password, curr.password)) return curr
        else
            throw new Error("incorrecctb ")
    } catch (e) {
        return e
    }
}

const user = mongoose.model('user', userSchema)
module.exports = user