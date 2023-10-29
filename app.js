const express = require('express');
const app = express();
const Routes = require('./Routes/User_Routes');
const adminRouter = require('./Routes/addmin_Routes');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const stripeSecretKey = 'sk_test_51Mr40CSGOCO7N9Qbb26Bhmc4fNAWLnXUBMbLXeX9jjGeYhkYXs0Quu5LjTBrkt7JoiV4i0OHc2FZ728lVIvQel1S00ibqRvTzv'; // Replace with your actual Stripe secret key
const stripe = require('stripe')(stripeSecretKey);
const verifyRole = require('./veifyrole.js');
const multer  = require('multer')
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');

app.use(cookieParser());
app.use(cors()); 

require('./conn');
app.use(express.json());

app.use('/apoo', Routes);
app.use('/admin',adminRouter)

// app.use((err, req, res, next) => {
//   console.error(err);
//   res.status(500).json({ error: 'Internal Server Error' });
// });

// app.use((req, res, next) => {
//   res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
//   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
//   res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
//   next();
// });

// Rest of your server code
app.get('/admin', verifyRole('user'), (req, res) => {
  // This route will only be accessible to users with the 'admin' role
  res.json({ message: 'Admin route accessed successfully' });
});
app.get('/admin-dashboard', (req, res) => {
  // Place your admin dashboard logic here
  res.send('Welcome to the admin dashboard!');
});


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads'); // Store uploaded files in the 'uploads' directory
  },
  filename: (req, file, cb) => {
    const fileName = Date.now() + path.extname(file.originalname);
    cb(null, fileName);
  },
});

const upload = multer({ storage });

// Define the route for file uploads
app.post('/apoo/uploads', upload.single('file'), (req, res) => {
  if (req.file) {
    res.json({ success: true, message: 'File uploaded successfully' });
  } else {
    res.json({ success: false, message: 'File upload failed' });
  }
});
app.use(cookieParser());

app.use(bodyParser.json());

// Configure Nodemailer
const transporter = nodemailer.createTransport({
  service: 'Gmail', // Use your email service
  auth: {
    user: 'poorvsinojiya830@gmail.com',
    pass: 'uffw cgll xcrr mpae',
  },
});

app.post('/send-email', (req, res) => {
  const { recipient, subject, message } = req.body;

    console.log('Email route accessed');
    // Rest of your code

  const mailOptions = {
    from: 'poorvsinojiya830@gmail.com',
    to: recipient,
    subject: subject,
    text: message,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error:', error);
      res.status(500).json({ message: 'Email could not be sent' });
    } else {
      console.log('Email sent:', info.response);
      res.json({ message: 'Email sent successfully' });
    }
  });
});
app.listen(7000, () => {
  console.log('Server is running on port 8000');
});
// Example endpoint to stop the server gracefully
