const express = require('express')
require("./db/mongoose")
const bcrypt = require('bcrypt')
const hacker = require("./models/hacker")
const router=require("./db/router")
const taskRouter=require("./db/taskRouter")
const auth=require("./middleware/auth")
const {basic, basicRouter}= require("./models/basic")


const app = express()
// const port= process.env.port
const port = 8800

app.use((req,res,next)=>{
    console.log(req.method, req.path)
    next()
})

app.use(express.json())
app.use(router)
app.use(taskRouter)

app.use(basicRouter)




app.listen(port, () => {
    console.log("listening on port 8800")
})