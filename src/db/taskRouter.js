const express = require('express')
const task = require("../models/task")
const auth = require("../middleware/auth")
const chalk = require("chalk")
const user=require("../models/user")
// const port= process.env.port 


const taskRouter = express.Router()
taskRouter.get("/task",auth, async (req, res) => {
    let match={
        // completed:false,
        
    }
    try { 
        let curruser=req.user
        await curruser.populate({
            path:'tasks',
            options:{
                limit:4, 
                sort:{
                    createdAt:1
                }
            }
        }).execPopulate()
        res.send(curruser.tasks)
        // console.log(chalk.blue(curruser.tasks))
    }
    catch (e) {
        res.status(401).send(e)
    }
})

taskRouter.post("/task",auth, async (req, res) => {
    const newtask = new task({
        ...req.body,
        owner:req.user._id
    })
    try {
        await newtask.save()
        await newtask.populate('owner').execPopulate()
        res.status(201).send(newtask)
        
        console.log(chalk.redBright(newtask.owner))

        let curruser=await user.findById(newtask.owner._id)
        await curruser.populate("tasks").execPopulate()
        console.log(chalk.blue(curruser.tasks))
    }
    catch (e) {
        res.status(401).send(e)
    }
})


 

  

// taskRouter.post("/task/logout", auth, async (req, res) => {
//     try {

//         req.task.tokens = req.task.tokens.filter((token) => {
//             return token.token !== req.token
//         })
//         await req.task.save()

//         console.log(chalk.red(req.task.tokens.length))
//         res.send("successfully loged out")
//     }
//     catch (e) {
//         res.status(500).send("still loged in ")
//     }
// })

// taskRouter.get("/task", auth, async (req, res) => {
//     try {
//         // res.send("hey")
//         let taskslist = await task.find({})
//         // console.log(taskslist)
//         res.status(200).send(taskslist)
//         // console.log()
//     }
//     catch (e) {
//         console.log("error occured")
//         // res.status(401).send(e)
//     }

// })

// taskRouter.get("/task/:id", (req, res) => {
//     const id = req.params.id
//     task.findById(id).then((curr) => {
//         res.send(curr)
//     }).catch((error) => {
//         res.send(error)
//     })
// })

// taskRouter.patch("/task/me",auth, async (req, res) => {
 
//     let updates = Object.keys(req.body)

//     // console.log(updates)

//     try {
//         let currtask = req.task
//         updates.forEach((update) => {
//             currtask[update] = req.body[update]
//         })
//         await currtask.save()
//         res.send(currtask)
//     }
//     catch (e) {
//         res.status(401).send(e)
//     }

//     // task.findByIdAndUpdate(id, req.body,{new:true, runValidators:true}).then((curr) => {
//     //     res.send(curr)
//     // }).catch((error) => {
//     //     res.send(error)
//     // })
// })

// taskRouter.delete("/task/me", async (req, res) => {
//     const id = req.params.id
//     try {
//         console.log("deleting")
//         const del = await task.findByIdAndDelete(req.task._id)
//         console.log(del)
//         res.send(del)
//     }
//     catch (e) {
//         res.status(401).send(e)
//     }
// })
module.exports = taskRouter