const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/BookyDB', { useNewUrlParser: true, useUnifiedTopology: true });

const BookycontactModel = mongoose.model('Bookycontact', {
    fName: String,
    lName: String,
    email: String,
    phoneNum: Number,
    sex: String,
    age: Number
});

// TODO: define contact schema
module.exports = BookycontactModel;