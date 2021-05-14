const user = require("../models/user")
const jwt = require("jsonwebtoken")
const chalk = require('chalk')
const auth = async (req, res, next) => {
    try {
        // console.log(chalk.blue(req.header('Authorization')))
        const token = req.header('Authorization').replace('Bearer ','')
        // console.log(chalk.redBright(token))
        const decoded =await jwt.verify(token, "randomkeyword")
        // console.log(chalk.bgRed("finding header"))
        const curruser = await user.findOne({ _id: decoded._id, 'tokens.token': token })

        if (!curruser) throw new Error()

        req.token=token
        req.user = curruser
        
        // console.log(chalk.green(curruser))
        // console.log(chalk.yellowBright(token))
        
    }
    catch (e) {
        console.log(e)
        res.status(401).send("please Authenticate stupid fuck")
    }


    next()
}

module.exports = auth