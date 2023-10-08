const express = require('express');
const app = express();
const Routes = require('./Routes/User_Routes');
const adminRouter = require('./Routes/addmin_Routes');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const stripeSecretKey = 'sk_test_51Mr40CSGOCO7N9Qbb26Bhmc4fNAWLnXUBMbLXeX9jjGeYhkYXs0Quu5LjTBrkt7JoiV4i0OHc2FZ728lVIvQel1S00ibqRvTzv'; // Replace with your actual Stripe secret key
const stripe = require('stripe')(stripeSecretKey);
const verifyRole = require('./veifyrole.js');

app.use(cookieParser());
app.use(cors()); 

require('./conn');
app.use(express.json());

app.use('/apoo', Routes);
app.use('/admin',adminRouter)

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal Server Error' });
});

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

app.listen(7000, () => {
  console.log('Server is running on port 8000');
});
// Example endpoint to stop the server gracefully
