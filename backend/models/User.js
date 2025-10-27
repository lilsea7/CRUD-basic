const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/.+@.+\..+/, 'Invalid email format'],
  },
  age: {
    type: Number,
    required: true,
    min: [0, 'Age must be >= 0'],
  },
}, {
  timestamps: true,
});


module.exports = mongoose.model('User', userSchema);