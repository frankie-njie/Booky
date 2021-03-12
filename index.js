const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const ejs = require('ejs');
const multer = require('multer');
const csv = require('csvtojson');
const fs = require('fs');
// const { Parser } = require('json2csv');
//const https = require('https');
// const path = require('path');

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

let upload = multer({ storage });

app.get("/", async function(req, res) {

    let allContacts = async () => {
        return await BookycontactModel.countDocuments({},  (err, val) => { 
            if(err){
                console.log(err);
                throw err;
            }
            return val;
        });
    }
    let maleContacts = async () => {
        return await BookycontactModel.countDocuments({sex: "M"}, function(err, val){
            if(err){
                console.log(err);
                throw err;
            }
            return val;
        });
    } 
    let femaleContacts = async () => {
        return await BookycontactModel.countDocuments({sex: "F"}, function(err, val){
            if(err){
                console.log(err);
                throw err;
            }
            return val
        });

    }
    const countAll = await allContacts();
    const mCount = await maleContacts();
    const fCount = await femaleContacts();
    //console.log( countAll, mCount, fCount);

    res.render("home", {countAll: countAll, maleContacts: mCount, femaleContacts: fCount} );

});

//Endpoint for Search functionality on the home page
app.get("/search", function(req, res) {
    if (!req.query.q) {
        return;
    }
    //Read the query
    const query = new RegExp(`.*${req.query.q}.*`, 'i');
    const mongoQuery = { $or: [{ fName: query }, { lName: query }, { email: query }] };

    //Find the query
    BookycontactModel.find(mongoQuery, function(err, contacts) {
        //console.log(contacts)
        if (err) {
            console.log(err);
            throw err;
        }
        //Print query
        return res.send(contacts);
    });

});

//General search page
app.get("/generalsearch", async function(req, res) {
    let {page = req.params.page || 1, limit = 10} = req.query
    // const page = res.query.page
    // const contactsPerPage = 10
    
    if (page < 1) {
        page = 1
    }
    const contact = await BookycontactModel.find()
    .limit(limit * 1)
    .skip((page - 1) * limit)

    const total = await BookycontactModel.countDocuments()

    res.render("generalsearch", { contact: contact, total: total, totalPages: Math.ceil(total/limit) })
    //console.log(post);

    // BookycontactModel.find({}, function(err, contact) {
    //     if (err) {
    //         console.log(err);
    //         throw err;
    //     }
    //     //Send all data from database
    //     //console.log(contact);
    //     res.render("generalsearch", { contact: contact })
    // })
});


//Endpoint fot general search
app.get("/searchAll", function(req, res) {
    //Read the queries
    let {page = req.params.page || 1, limit = 10} = req.query
    if (page < 1) {
        page = 1
    }

    const query = new RegExp(`.*${req.query.q}.*`, 'i');
    const querySex = new RegExp(`.*${req.query.sex}.*`, 'i')
    const queryMinAge = req.query.minAge
    const queryMaxAge = req.query.maxAge
    let mongoQuery = {}
    if (req.query.q) {
        mongoQuery['$or'] = [{fName: query}, {lName: query}, {email: query}]
    }
    if (req.query.sex){
        mongoQuery['sex'] = querySex
    }
    // {age: {$gte: x, $lte: x}}
    if (req.query.minAge || req.query.maxAge){
        let ageRangeObj = {}
        if (req.query.minAge){
            ageRangeObj['$gte'] = queryMinAge
        }
        if (req.query.maxAge){
           ageRangeObj['$lte'] = queryMaxAge
        }
        mongoQuery['age'] = ageRangeObj
    }
    //console.log(mongoQuery);    

    //Find queries in database
    BookycontactModel.find(mongoQuery, function(err, contacts) {
            if (err) {
                console.log(err);
                throw err;
            } else {
                res.send(contacts)
            }
        }).limit(limit * 1)
        .skip((page - 1) * limit)

});

app.get('/download', async function(req, res){
    const query = new RegExp(`.*${req.query.q}.*`, 'i');
    const querySex = new RegExp(`.*${req.query.sex}.*`, 'i')
    const queryMinAge = req.query.minAge
    const queryMaxAge = req.query.maxAge
    let mongoQuery = {}

    if (req.query.q) {
        mongoQuery['$or'] = [{fName: query}, {lName: query}, {email: query}]
    }
    if (req.query.sex){
        mongoQuery['sex'] = querySex
    }
    // {age: {$gte: x, $lte: x}}
    if (req.query.minAge || req.query.maxAge){
        let ageRangeObj = {}
        if (req.query.minAge){
            ageRangeObj['$gte'] = queryMinAge
        }
        if (req.query.maxAge){
           ageRangeObj['$lte'] = queryMaxAge
        }
        mongoQuery['age'] = ageRangeObj
    } 

    //Find queries in database
    const getContacts = await BookycontactModel.find(mongoQuery, function(err, contacts) {
            if (err) {
                console.log(err);
                throw err;
            } else {
                // res.send(contacts)
                return contacts;
            }
        })
        //console.log(getContacts);

    let keys = ["fName", "lName", "email", "phoneNum", "sex", "age"];
    allVars = "";

    getContacts.forEach(contact => {
        var values = []
        keys.forEach(key => {
           value = contact[key];
           values.push(value)
        });
        let str = values.toString() + "\n"
        allVars += str;
    })
    let result = keys.toString() + "\n"  + allVars;
    //res.send(result)

    fs.writeFile('./contacts.csv', result, function (err) {
        if (err) return console.log(err);
        res.download("./contacts.csv");
      });      

});


//Post from the home page mainly to convert the csv to Json
app.post('/', upload.single('csv-file'), (req, res, next) => {
    const file = req.file
        // console.log(file);
    if (!file) {
        const error = new Error('Please upload a file')
        error.httpStatusCode = 400
        return next(error)
    }

    const wrongFormat = [];

    //Convert csv to JsonObject
    csv().fromFile(req.file.path)
        .then(function(jsonObj) {
            //console.log("jsonObj: ", jsonObj);

            const nameMappings = {
                fName: ['first name', 'prenom', 'prénom', ],
                lName: ['last name', 'family name', 'surnom', 'nom de famille', ],
                email: ['email', 'mail', 'email address', 'address mail'],
                phoneNum: ['phone', 'number', 'phone number', 'no', 'phone no', 'phone num'],
                sex: ['sex', 'gender'],
                age: ['age']
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
            if (newJsonObj && newJsonObj.length > 0) {
                newJsonObj.forEach(contact => {
                    // console.log("newjsonObj", newJsonObj)

                    if (!contact.email) {
                        wrongFormat.push(contact);
                        newJsonObj.slice(contact);
                        // console.log("This element does not have and email address", contact);
                        // console.log("This is the wrong format" ,wrongFormat);
                    } else {
                        const booky = new BookycontactModel(contact);
                        // console.log("this is contact",contact);

                        booky.save((err) => {
                            if (err) throw err;
                            else console.log("> Saved !");
                        });
                    }

                });
            } else {
                console.log("[x] Empty csv file !")
            }

        });


    res.send("your files have been saved");
})


// TODO: connect to db. If error, abort
// const dbURI = "mongodb://localhost:27017/contacts"
// mongoose.connect(dbURI).then(() => [
// ]).catch(err => {
//     console.error('Failed to connect to mongodb. Aborting', err)
// })

// start listening
app.listen(3000, function() {
    console.log("Server started on port 3000");
})