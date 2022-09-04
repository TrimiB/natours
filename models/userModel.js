const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

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
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, `Please confirm your password!`],
    validate: {
      // This only works on create and save !
      validator: function (value) {
        return value === this.password;
      },
      message: `Wrong password confirmation!`,
    },
  },
  passwordChangedAt: Date,
});
// Mongoose middleware pre 'save' (before presisting data to DB)
userSchema.pre('save', async function (next) {
  // if this password is NOT modified, return and call next() middleware.
  if (!this.isModified('password')) return next();

  // here we encrypt (hash) our password with coast of 12 - bcrypt
  this.password = await bcrypt.hash(this.password, 12);

  // then we set passwordConfirm to undefined and call next() middleware.
  this.passwordConfirm = undefined;
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimespamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimespamp < changedTimestamp;
  }

  // False means not changed
  return false;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
