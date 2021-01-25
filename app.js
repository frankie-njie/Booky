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
        cb(null, file.fieldname);
    }
});
let upload = multer({ storage});


app.use(express.static('public'));
app.set('view engine', 'ejs');

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
    if (!file) {
      const error = new Error('Please upload a file')
      error.httpStatusCode = 400
      return next(error)
    }
    res.send("Your files has been saved"); 
})

//${__dirname}/public/${req.file.filename}


app.listen(3000, function(){
    console.log("Server started on port 3000");
});