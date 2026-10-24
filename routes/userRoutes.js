const express = require('express');
const router = express.Router();
const User = require('../models/user');

// Department lookup map based on 3-digit dept codes
const DEPARTMENT_MAP = {
  // B.Tech / Undergraduate Engineering
  '101': 'Computer Science & Engineering',
  '102': 'Electrical Engineering',
  '103': 'Mechanical Engineering',
  '104': 'Civil Engineering',
  '105': 'Electronics & Communication Engineering',
  '106': 'Chemical Engineering',
  '107': 'Metallurgical & Materials Engineering',
  '108': 'Biotechnology',
  '109': 'Engineering Physics',
  '110': 'Data Science & Artificial Intelligence',
  '111': 'Production & Industrial Engineering',
  '112': 'Biosciences & Bioengineering',

  // Architecture & Design
  '201': 'B.Arch (Architecture)',
  '202': 'Bachelor of Design (B.Des)',

  // Integrated Masters & Dual Degrees (5-Year)
  '301': 'Integrated M.Tech (Geological Technology)',
  '302': 'Integrated M.Tech (Geophysical Technology)',
  '303': 'Integrated M.Sc (Applied Mathematics)',
  '304': 'Integrated M.Sc (Physics)',
  '305': 'Integrated M.Sc (Chemistry)',

  // Postgraduate / Management
  '401': 'Master of Business Administration (MBA)',
  '402': 'Master of Computer Applications (MCA)',
};

// Helper function to decode enrollment number
function parseEnrollmentNumber(enrollmentNumber) {
  if (!/^\d{8}$/.test(enrollmentNumber)) {
    return { valid: false, error: 'Enrollment number must be exactly 8 digits' };
  }

  const yearDigits = enrollmentNumber.substring(0, 2);
  const deptCode = enrollmentNumber.substring(2, 5);
  const serialNo = enrollmentNumber.substring(5, 8);

  const yearOfEntry = 2000 + parseInt(yearDigits, 10);
  const department = DEPARTMENT_MAP[deptCode] || `Department Code (${deptCode})`;

  return {
    valid: true,
    yearOfEntry,
    department,
    serialNo,
  };
}

// 1. Register a new student
router.post('/register', async (req, res) => {
  try {
    const { name, enrollmentNumber, bhawan, roomNumber, password, role } = req.body;

    // Validate and parse enrollment number
    const parsed = parseEnrollmentNumber(enrollmentNumber);
    if (!parsed.valid) {
      return res.status(400).json({ message: parsed.error });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ enrollmentNumber });
    if (existingUser) {
      return res.status(400).json({ message: 'Student with this Enrollment Number already exists' });
    }

    // Create new user object
    const newUser = new User({
      name,
      enrollmentNumber,
      department: parsed.department,
      yearOfEntry: parsed.yearOfEntry,
      bhawan,
      roomNumber,
      password,
      role: role || 'student',
    });

    const savedUser = await newUser.save();
    res.status(201).json({ message: 'User registered successfully', user: savedUser });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// 2. Sign In / Login
router.post('/login', async (req, res) => {
  try {
    const { enrollmentNumber, password } = req.body;

    const user = await User.findOne({ enrollmentNumber });
    if (!user) {
      return res.status(404).json({ message: 'Student not found. Please register first.' });
    }

    if (user.password !== password) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    res.json({
      message: 'Login successful',
      user: {
        _id: user._id,
        name: user.name,
        enrollmentNumber: user.enrollmentNumber,
        department: user.department,
        yearOfEntry: user.yearOfEntry,
        roomNumber: user.roomNumber,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;