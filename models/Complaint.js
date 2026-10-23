const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
  studentName: {
    type: String,
    required: true,
  },
  rollNumber: {
    type: String,
    required: true,
  },
  roomNumber: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ['Electricity', 'Plumbing', 'Cleanliness', 'Furniture', 'Internet', 'Other'],
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['Pending', 'In Progress', 'Resolved'],
    default: 'Pending',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Complaint', complaintSchema);