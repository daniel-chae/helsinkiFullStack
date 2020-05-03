const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

// Create uesrSchema
const userSchema = mongoose.Schema({
  username: {
    type: String,
    unique: true,
    minlength: 3,
    required: true,
  },
  name: String,
  hashedPassword: String,
  blogs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Blog',
    },
  ],
});

// Transform for json response
userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id;
    delete returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject.hashedPassword;
  },
});

// User external validator for field uniqueness
userSchema.plugin(uniqueValidator);

// Create User model
const User = mongoose.model('User', userSchema);

module.exports = User;
