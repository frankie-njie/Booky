const mongoose = require('mongoose');
const Schema = mongoose.Schema;

mongoose.connect('mongodb://127.0.0.1:27017/BookyDB', {useNewUrlParser: true, useUnifiedTopology: true});

// const bookSchema = new Schema({
//     fName: {
//       type: String,
//     },
//     lName: {
//         type: String,
//       },
//       email:  {
//         type: String,
//         required: true
//       },
//       phoneNum: {
//         type: Number,
//       },
//       sex:  {
//         type: String
//       },
//   });

//   bookSchema.path('email').validate(function (email) {
//     var emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
//     return emailRegex.test(email.text);
//  }, 'The e-mail field cannot be empty.')

// const BookycontactModel = mongoose.model('Bookycontact', bookSchema);

const BookycontactModel = mongoose.model('Bookycontact', {
    first_name : String,
    last_name : String,
    email_address : String,
    phone_number : Number,
    sex : String
});

// TODO: define contact schema
module.exports = BookycontactModel;
