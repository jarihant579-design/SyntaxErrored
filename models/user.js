const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  enrollmentNumber: {
    type: String,
    required: true,
    unique: true,
    match: [/^\d{8}$/, 'Enrollment number must be exactly 8 digits'],
  },
  department: {
    type: String,
    required: true,
  },
  yearOfEntry: {
    type: Number,
    required: true,
  },
  bhawan: {
    type: String,
    required: true,
  },
  roomNumber: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['student', 'warden', 'admin'],
    default: 'student',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('User', userSchema);