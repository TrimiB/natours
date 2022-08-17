const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, `Please enter a user name!`],
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: [true, `Please enter an email!`],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, `Please enter a valid email`],
  },
  photo: String,
  password: {
    type: String,
    required: [true, `please enter a password!`],
    minlength: [8, `Password must be longer than 8 characters!`],
  },
  passwordConfirm: {
    type: String,
    required: [true, `Please confirm your password!`],
    validate: {
      validator: function (value) {
        return value === this.password;
      },
      message: `Wrong password confirmation!`,
    },
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
