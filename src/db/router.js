const express = require('express')
const user = require("../models/user")
const router = express.Router()
const auth = require("../middleware/auth")
const chalk = require("chalk")
const multer = require("multer")
const sharp = require("sharp")
// const port= process.env.port 
const upload = multer({
    limits: 1000000,
    fileFilter(req, file, cb) {

        if (!file.originalname.match(/\.(jpg|jpeg|jpe|jif|png|webp|psd)$/)) {
            return cb(new Error("not accepted file type"))
        }
        return cb(undefined, true)
    }
})

router.post("/user/me/avatar", auth, upload.single("avatar"), async (req, res) => {

    try {
        // console.log("uploading")
        let buffer= await sharp(req.file.buffer).resize({widht:300, height:300})
        .png().toBuffer()
        // console.log("uploading")
        req.user.avatar = buffer
        await req.user.save()
        res.send("uploaded successfully")
    }
        catch (e) {
            // console.log(e)
            res.status(401).send(e)
        }
    

}, (error, req, res, next) => {
    res.send({ error: error.message })
})
router.delete("/user/me/avatar", auth, async (req, res) => {
    req.user.avatar = undefined
    await req.user.save()
    res.send("deleted successfully")
})

router.post("/user", async (req, res) => {
    const newuser = new user(req.body)
    try {
        await newuser.save()
        res.status(201).send("successfully addded")
    }
    catch (e) {
        res.status(401).send(e)
    }
})

router.post("/user/signup", async (req, res) => {
    try {
        // console.log("siginig up")
        let curruser = new user(req.body)
        await curruser.save()
        let token = await curruser.getAuthToken()
        res.send({ curruser, token })
    }
    catch (e) {
        res.status(401).send(e)
    }
})

router.post("/user/login", async (req, res) => {
    try {
        // console.log(req.body)
        let curruser = await user.findByCredential(req.body.email, req.body.password)
        const token = await curruser.getAuthToken()
        console.log({ curruser, token })
        res.send({ curruser, token })
    }
    catch (e) {
        res.status(401).send(e)
    }
})




router.get("/user/me", auth, async (req, res) => {
    try {
        res.send(req.user)
    }
    catch (e) {
        console.log(e)
    }

})

router.post("/user/logoutAll", auth, async (req, res) => {
    try {
        console.log("logging out all")
        req.user.tokens = []
        await req.user.save()

        // console.log(chalk.red(req.user.tokens.length))
        res.send("successfully loged out all users")
    }
    catch (e) {
        res.status(500).send("still loged in ")
    }
})

router.post("/user/logout", auth, async (req, res) => {
    try {

        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()

        console.log(chalk.red(req.user.tokens.length))
        res.send("successfully loged out")
    }
    catch (e) {
        res.status(500).send("still loged in ")
    }
})

router.get("/user", auth, async (req, res) => {
    try {
        // res.send("hey")
        let userslist = await user.find({})
        // console.log(userslist)
        res.status(200).send(userslist)
        // console.log()
    }
    catch (e) {
        console.log("error occured")
        // res.status(401).send(e)
    }

})

// router.get("/user/:id", (req, res) => {
//     const id = req.params.id
//     user.findById(id).then((curr) => {
//         res.send(curr)
//     }).catch((error) => {
//         res.send(error)
//     })
// })

router.patch("/user/me", auth, async (req, res) => {

    let updates = Object.keys(req.body)

    // console.log(updates)

    try {
        let curruser = req.user
        updates.forEach((update) => {
            curruser[update] = req.body[update]
        })
        await curruser.save()
        res.send(curruser)
    }
    catch (e) {
        res.status(401).send(e)
    }

    // user.findByIdAndUpdate(id, req.body,{new:true, runValidators:true}).then((curr) => {
    //     res.send(curr)
    // }).catch((error) => {
    //     res.send(error)
    // })
})

router.delete("/user/me", auth, async (req, res) => {
    const id = req.params.id
    try {
        console.log("deleting")
        let curr = await user.deleteOne({ _id: req.user._id })
        res.send(curr)
    }
    catch (e) {
        // console.log(e)
        res.status(401).send(e)
    }
})

router.get("/user/:id/avatar", async (req, res) => {

    try {
        console.log("getting avatar")
        let requser = await user.findById(req.params.id)
        if (!requser || !requser.avatar) {
            throw new Error("avatar not found")
        }
        console.log("found the avatar")
        res.set('Content-Type', 'image/png')
        res.send(requser.avatar)
    }
    catch (e) {
        res.status(401).send(e)
    }
})
module.exports = router