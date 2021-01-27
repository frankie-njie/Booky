const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/BookyDB', {useNewUrlParser: true, useUnifiedTopology: true});

// TODO: define contact schema
const bookySchema = {
    fName : String,
    lName : String,
    email : String,
    phoneNum : Number,
    Sex : String
}

const BookycontactModel = mongoose.model('Bookycontact', bookySchema);

exports.BookycontactModel = BookycontactModel;
