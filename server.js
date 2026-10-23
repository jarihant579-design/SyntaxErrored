const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Initialize express app
const app = express();

// Middleware (Must come before routes!)
app.use(express.json());
app.use(cors());

// Import Routes
const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);

// Import Complaint Routes
const complaintRoutes = require('./routes/complaintRoutes');
app.use('/api/complaints', complaintRoutes);

// Connect to MongoDB Atlas
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected successfully! 🍃'))
  .catch((err) => console.log('Database connection error:', err));

// Test Route
app.get('/', (req, res) => {
  res.send("Hostel Management Backend is live and running! 🚀");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});