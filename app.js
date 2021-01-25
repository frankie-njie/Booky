const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const ejs = require('ejs');
const multer = require('multer');

const app = express();

// Store uploaded files
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/');
    },

    // By default, multer removes file extensions so let's add them back
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

app.use(express.static('public'));
app.set('view engine', 'ejs');

app.get("/" , function(req, res){
    res.render("home");
});

app.post("/", function(req, res){
     let upload = multer({ storage}).single('csv-file');
     console.log(upload);
     res.render("file")
     res.send("Your files has been saved");

    //  res.render("file",function(req, res){
    //     res.send("Your files has been saved");
    //  })
 
})

//${__dirname}/public/${req.file.filename}


app.listen(3000, function(){
    console.log("Server started on port 3000");
});