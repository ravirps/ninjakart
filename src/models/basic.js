
const mongoose = require('mongoose');
const validator = require('validator');
const express = require('express')
const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken')
const AdmZip = require('adm-zip');
const multer = require("multer")
const sharp = require("sharp") 
const cp = require("child_process")
const fs = require("fs")
const path = require("path")
// const react=require("react")
// const ReactDOMServer= require("react-dom/server")
// const App =
// require("../../../reactApp/firstapp/src/App.js")
 
function getFileExtension(filename){

    // get file extension
    const extension = filename.split('.').pop();
    return extension;
}
const upload = multer({
    fileFilter(req, file, cb) {
        req.originalFileName = (file.originalname)
        req.extension=getFileExtension(file.originalname)
        // console.log("extentison is ", req.extens)
        return cb(undefined, true)
    }
})


let basicSchema = new mongoose.Schema({
    fileitem: {
        type: Buffer,
        required: true
    }
}, {
    timestamps: true
})

const basic = mongoose.model('basic', basicSchema)

let basicRouter = express.Router()

basicRouter.post("/upload", upload.single("fileitem"), async (req, res) => {
    // res.send("hey itss me")
    console.log("uploading")
    try {



        let zip = new AdmZip(req.file.buffer);
        console.log()
        let zipEntries = zip.getEntries(); // an array of ZipEntry records
        zip.extractAllTo(/*target path*/"./extracted_files/" + req.originalFileName + "/", /*overwrite*/true);
        res.send("extracted and saved")
    }
    catch (e) {
        console.log("error send")
        res.send(e)
    }
})

basicRouter.post("/ls", async (req, res) => {
    try 
    {
        // console.log("here")
        // const data = fs.writeFileSync('../../reactApp/firstapp/.env', 
        // "PORT=8888 ")
        cp.exec('npm start --prefix "../../reactApp/firstapp" he', 
        function (err, stdout, stderr) {
            if (err) {
                console.log(err)
                res.status(501).send(err)
            }
            // res.send("done successfully")
        })
        res.send("done successfully")

    }catch (e) {
            console.log("error occured", e)
            res.status(400).send(e)
        }
    }
)



module.exports = {
    basic,
    basicRouter
}