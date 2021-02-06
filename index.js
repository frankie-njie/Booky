const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const ejs = require('ejs');
const multer = require('multer');
const csv = require('csvtojson');
// const path = require('path');

const BookycontactModel = require("./models/BookyContact");
const json = require('body-parser/lib/types/json');
//const {json} = require('body-parser');

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


app.post('/', upload.single('csv-file'), (req, res, next) => {
    const file = req.file
    // console.log(file);
    if (!file) {
      const error = new Error('Please upload a file')
      error.httpStatusCode = 400
      return next(error)
    }

    //convert csv to json format
    csv().fromFile(req.file.path)
    .then(function (jsonObj) {
         //console.log("jsonObj: ", jsonObj);

    // TODO: Check for Required fields
    // const reqFields = ['email', 'first name', 'last name', 'phone'];
    // const CONTACT_NAMES = ['first name','last name'];

    // const validateContactFields = arr => {
    //     arr = arr.map(ele => ele.toLowerCase());
    //     let status = true;

    //     for (let index = 0; index < reqFields.length; index++) {
    //         if(!arr.includes(reqFields[index])) {
    //             status = false;
    //             break;
    //         }
    //     }
    // }

    // const nameMappings = {
    //     fName: ['first name', 'prenom', 'prénom',],
    //     lName: ['last name', 'family name', 'surnom', 'nom de famille',],
    //     email: ['email', 'mail', 'email address', 'address', ],
    //     phoneNum: ['phone', 'number', 'phone number', 'no', 'phone no', 'phone num'],
    //     sex: ['sex', 'gender'],
    // }

    const parsedObj = [];
    jsonObj.forEach((el, val) => {
        const newObj = {}
        for(keys in el) {
            //console.log(keys);
            const newKey = keys.split(' ').join('_').toLowerCase();
            //console.log(newKey)
            newObj[newKey] = el[keys];
            //console.log("result: ", newObj[newKey] = el[keys]);
        }
        parsedObj.push(newObj);
        //console.log(parsedObj.push(newObj));
    })
    // console.log('new parsed res ===>', parsedObj);
   
    // TODO: for each line in file, add to db
        if (parsedObj && parsedObj.length > 0){
            parsedObj.forEach(contact => {
                //console.log("parsedObj : ", parsedObj);

            if(!(contact.email_address || contact.email)){
                wrongFormat.push(contact);
                parsedObj.slice(contact);
                // console.log("This element does not have and email address", contact);
                // console.log("This is the wrong format" ,wrongFormat);
            }else{
                const booky = new BookycontactModel(contact);

                console.log(' case 1', contact);


                booky.save((err) => {
                    if (err) throw err;
                    else console.log("> Saved !");
                });
            }
        });
                

            
            // jsonObj.forEach((contact, index) => {

            //     const contactsKeys = Object.keys(contact);
            //     // validate
            //     contactsKeys.map(con => {
            //         if(reqFields.includes(con.toLowerCase()))
            //             console.log()

            //         // else console.error(contact)
                    
            //     })

            //     // // validation for email address 
            //     // if(contact["Email Address"] || contact.email === ""){
            //     //     contact.slice(index);
            //     //     console.log("This element does not have and email address, email address is required", contact);
            //     // }else if (!(contact["First Name"] || contact["first Name"])){
            //     //     console.log(contact);
                    
            //     // }

            //     // console.log("> Insert : ", contact["Email Address"] || contact.email);

            //     // const book = {
            //     //     "fName" : contact["First Name"] || contact["first Name"],
            //     //     "lName" : contact["Last Name"] || contact["last Name"],
            //     //     "email" : contact["Email Address"] || contact.email,
            //     //     "phoneNum" : contact["Phone Number"] || contact.phone ,
            //     //     "Sex": "" ||  contact.Sex
            //     // }
            //     // console.log(book);

            
           
        }else{
            console.log("[x] Empty csv file !")
        }
    });

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
