// var mongoose = require('mongoose');
//
// var User = mongoose.model('User', {
//   username: {
//     type: String,
//   },
//   password: {
//     type: String,
//   },
//   api_key:{
//     type: String
//   }
// });
//
// module.exports = {
//   User: User
// }

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var UserSchema = new Schema({
  username: {
    type: String,
  },
  password: {
    type: String,
  },
  api_key:{
    type: String
  }
});

module.exports =  mongoose.model('User', UserSchema)
