const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const ejs = require('ejs');
const multer = require('multer');
const csv = require('csvtojson');
// const path = require('path');

const BookycontactModel = require("./models/BookyContact");
// const getBookyContacts = require("./models/getBookyContact");
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

app.get("/search", function(req, res){
    //Read the query
    const query = req.query.q.toLowerCase();
    const mongoQuery = { $or: [ { first_name: query }, { last_name: query }, ] };
    console.log(mongoQuery);
    //Find the query
    const contact = BookycontactModel.find({}, function(err, contacts){
        if (err){
            console.log(err);
            throw err;
        }

        contacts.forEach(bookyContact => {
            //console.log(bookyContact);
            let keys = Object.keys(bookyContact);
            console.log("keys for bookycontact", keys);

            // keys.forEach(key => {
            //     if(key.includes(query)){
            //         console.log(key);
            //         return key
            //     };
            // });

            // for (const key in bookyContact) {
            //     if (bookyContact.hasOwnProperty.call(object, key)) {
            //         const element = object[key];
            //         console.log(element);
                    
            //     }
            // }
        });

        // const filteredContacts = contacts.filter((contact) => {
        //     for (const key in contact) {
        //         if (contact[key].includes(query)) {
        //             return true;
        //         }
        //     }
        // });
        // console.log('Filtered contacts:', filteredContacts);
        // return filteredContacts;
    })
    //Print query
});


app.post('/', upload.single('csv-file'), (req, res, next) => {
    const file = req.file
    // console.log(file);
    if (!file) {
      const error = new Error('Please upload a file')
      error.httpStatusCode = 400
      return next(error)
    }

    const wrongFormat = [];

    // console.log("req.file.path: ", req.file.path);

  
    //Convert csv to JsonObject
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

    const nameMappings = {
        fName: ['first name', 'prenom', 'prénom',],
        lName: ['last name', 'family name', 'surnom', 'nom de famille',],
        email: ['email', 'mail', 'email address', 'address mail' ],
        phoneNum: ['phone', 'number', 'phone number', 'no', 'phone no', 'phone num'],
        sex: ['sex', 'gender'],
    }
    
    const newJsonObj = jsonObj.map((contactkey) => {
        const result = {};
        // For each individual contact, map each key using 'nameMapping'
        for (const key in contactkey) {
            const lowerCaseKey = key.toLowerCase();
            // Search the nameMappings obj for a match
            for (const prop in nameMappings) {
                if (nameMappings[prop].includes(lowerCaseKey)) {
                    result[prop] = contactkey[key];
                    break;                 
                }
            }
        }
        console.log(result);
        return result;
    });

        //console.log("newjsonObj", newJsonObj)


    // TODO: for each line in file, add to db
        if (newJsonObj && newJsonObj.length > 0){
            newJsonObj.forEach(contact => {
                // console.log("JsonObj : ", jsonObj);
                // console.log("newjsonObj", newJsonObj)

            if(!contact.email){
                wrongFormat.push(contact);
                newJsonObj.slice(contact);
                // console.log("This element does not have and email address", contact);
                // console.log("This is the wrong format" ,wrongFormat);
            }else{
                const booky = new BookycontactModel(contact);

               // console.log("this is contact",contact);

                booky.save((err) => {
                    if (err) throw err;
                    else console.log("> Saved !");
                });
            }

                
                //Compare jsonObj to array of required fields and map 
            //     if(validateContactFields(Object.keys(contact)) && contact.email ){
            //         const newContact = {}
            //         console.log("this one input", contact);

            //         Object.keys(contact).map(field => {
            //             const name = field.toLowerCase();

            //             if(CONTACT_NAMES.includes(name) ){
            //                 newContact[name[0] + "Name" ] = contact[field]
            //             }
            //             else newContact[name] = contact[field]
            //         })

            //         console.log("These are the contacts to be saved", newContact);
            //         return newContact
            //     }
            //     else console.log("These are the wrong input fields", contact)

            // })
            // jsonObj.forEach((contact, index) => {

            //console.log(contact);
               

    // TODO: for each line in file, add to db
        if (jsonObj && jsonObj.length > 0){
            jsonObj.forEach((contact, index) => {

                const book = {
                    "fName" : contact["First Name"] || contact["first Name"] || contact.prenom || contact["Prenom"],
                    "lName" : contact["Last Name"] || contact["last Name"],
                    "email" : contact["Email Address"] || contact.email,
                    "phoneNum" : contact["Phone Number"] || contact.phone ,
                    "Sex": "" ||  contact.Sex
                }

                // validation for email address 
                if(!contact.email){
                    wrongFormat.push(contact);
                    jsonObj.slice(index);
                    console.log("This element does not have and email address", contact);
                    console.log("This is the wrong format" ,wrongFormat);
                }else{
                    console.log(book);
    
                    const booky = new BookycontactModel(book);
    
                    console.log("> Insert : ", contact["Email Address"] || contact.email);


                    booky.save((err) => {
                        if (err) throw err;
                        else console.log("> Saved !");
                    });
                }            

            });
        }else{
            console.log("[x] Empty csv file !")
        }

    });


    //Search functionality
    // let searchText = req.body.search;
    // console.log(searchText)

    res.send("your files have been saved");
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
