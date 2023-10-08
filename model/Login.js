const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LoginSchema = new Schema({
  number: {
    type: String,
    required: true,
    minlength: 6,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'Signup',
    required: true,
  },
});

const Login = mongoose.model('Login', LoginSchema);
module.exports = Login;
