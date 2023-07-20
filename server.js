//require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const app = express();
app.use(cors({ origin: 'http://localhost:3000','*':'http://localhost:3000/' }));  

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

let otpStore = {};
app.use(express.json());

app.post('/sendOtp', async (req, res) => {
  const { email } = req.body;

  // Generate 6 digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000);
  otpStore[email] = otp;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Your OTP',
    text: `Your OTP is ${otp}`
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'OTP sent successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error sending OTP' });
  }
});
//test if server is responding
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Server is running' });
});

app.post('/verifyOtp', (req, res) => {
  const { otp, email } = req.body;

  if (otpStore[email] && otpStore[email] == otp) {
    delete otpStore[email];
    res.status(200).json({ message: 'Email verified successfully!' });
  } else {
    res.status(400).json({ message: 'Email verification failed. Please check the OTP and try again.' });
  }
});

app.listen(12345, () => {
  console.log('Server running on http://localhost:12345');
});

