const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const ejs = require('ejs');
const multer = require('multer');
const csv = require('csvtojson');
const path = require('path');

const BookycontactModel = require("./models/BookyContact");

const app = express();
app.set('view engine', 'ejs');
app.use(express.static('public'));


// Store uploaded files
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/');
    },

    // By default, multer removes file extensions so let's add them back
    filename: function(req, file, cb) {
        cb(null, file.fieldname);
    }
});

let upload = multer({ storage});

app.get("/" , function(req, res){
    res.render("home");
});

// app.post("/", function(req, res){
//      console.log(upload);
//      res.render("file")
//     //  res.render("file",function(req, res){
//     //     res.send("Your files has been saved");
//     //  })
// })

app.post('/', upload.single('csv-file'), (req, res, next) => {
    const file = req.file
    // console.log(file);
    if (!file) {
      const error = new Error('Please upload a file')
      error.httpStatusCode = 400
      return next(error)
    }

    // console.log("req.file.path: ", req.file.path);

    csv().fromFile(req.file.path)
    .then(function (jsonObj) {
        console.log("jsonObj: ", jsonObj);

        if (jsonObj && jsonObj.length > 0){
            jsonObj.forEach((contact, index) => {
                console.log("> Insert : ", contact["Email Address"]);

                const book = {
                    "fName" : contact["First Name"],
                    "lName" : contact["Last Name"],
                    "email" : contact["Email Address"],
                    "phoneNum" : contact["Phone Number"],
                    "Sex": ""
                }

                const booky = new BookycontactModel(book);

                booky.save((err) => {
                    if (err) throw err;
                    else console.log("> Saved !");
                });
            });
        }else{
            console.log("[x] Empty csv file !")
        }
    });

    // TODO: for each line in file, add to db
    res.send("Your files has been saved");
})


// TODO: connect to db. If error, abort
// const dbURI = "mongodb://localhost:27017/contacts"
// mongoose.connect(dbURI).then(() => [
// ]).catch(err => {
//     console.error('Failed to connect to mongodb. Aborting', err)
// })

// start listening
app.listen(3000, function(){
    console.log("Server started on port 3000");
})
