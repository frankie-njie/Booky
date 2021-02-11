const mongoose = require('mongoose');

const BookycontactModel = require("./BookyContact");

mongoose.connect('mongodb://127.0.0.1:27017/BookyDB', {useNewUrlParser: true, useUnifiedTopology: true});

const getBookyContacts = BookycontactModel.find({}, function(err, contacts){
    if (err){
        console.log(err);
    }else{
        console.log(contacts);
    }
})

module.exports = getBookyContacts;
