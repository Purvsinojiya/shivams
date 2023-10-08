const express = require('express');
const app = express();
const Signup = require('../model/Singup.js');
const Login = require('../model/Login.js');
const verification = require('../model/verification.js');
const bcrypt = require('bcryptjs');
const OTPGenerator = require('otp-generator');
const Product = require('../model/Product.js');
const twilio = require('twilio');
const axios = require('axios');
const stripeSecretKey = 'sk_test_51Mr40CSGOCO7N9Qbb26Bhmc4fNAWLnXUBMbLXeX9jjGeYhkYXs0Quu5LjTBrkt7JoiV4i0OHc2FZ728lVIvQel1S00ibqRvTzv'; // Replace with your actual Stripe secret key
const stripe = require('stripe')(stripeSecretKey);
const jwt = require('jsonwebtoken'); 
const Addresh =require('../model/Addresh')
const jwtKey="jwt";
const Order = require('../model/order')
const Profiles = require('../model/profile.js');
const localStorage = require('localStorage')



 // Replace with your Twilio phone number

const fast2sms = require('fast2sms');
const { Types } = require('mongoose');

const signup = async (req, res, next) => {
  const { name, email, number, password } = req.body;
    console.log("fjfjfjfj");
  if (!name || !email || !password || !number) {
  return res.status(400).json({ message: 'Please provide all the required fields' });
  }
  

  const user = await Signup.create({ name, email, password, number});
  
  
  
  // Save the user data in the database using the appropriate method provided by your ORM or model library
  
  // Assuming you're using Mongoose
  await user.save();
  
  return res.status(200).json({ message: 'successful signup' });
  };
  const buy = async (req, res, next) => {
    const { productName } = req.params;
    const { purchasedQuantity } = req.body;
  
    try {
      const stockEntry = await Stock.findOne({ productName });
  
      if (!stockEntry) {
        return res.status(404).json({ message: `${productName} not found in stock` });
      }
  
      if (stockEntry.currentStock < purchasedQuantity) {
        return res.status(400).json({ message: 'Insufficient stock' });
      }
  
      stockEntry.currentStock -= purchasedQuantity;
      await stockEntry.save();
      res.json(stockEntry);
    } catch (error) {
      console.error("Error updating stock:", error);
      res.status(500).json({ message: 'Error updating stock', error });
    }
  };
  const Addres = async (req, res, next) => {
    const { country, state, city, streetAddress, pincode } = req.body;

  // Perform validation if necessary
  if (!country || !state || !city || !streetAddress || !pincode) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  const user = await Addresh.create({ country,state,city,streetAddress,pincode});
 await user.save();
 return res.status(200).json({ message: 'successful' });
  // Save the address data to the in-memory storage (you should use a database)
  
  }
const Products = async(req, res, next) => {
  const productId = req.params.id;

  try {
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    return res.json(product);
  } catch (err) {
    console.error('Error fetching product:', err);
    return res.status(500).json({ error: 'Error fetching product' });
  }
};
const getAllMovies = async (req, res, next) => {
  try {
    // Fetch all movies from the database
    const movies = await Product.find({});

    // If no movies are found, respond with an empty array
    if (!movies || movies.length === 0) {
      return res.json([]);
    }

    // If movies are found, respond with the array of movies
    return res.json(movies);
  } catch (err) {
    console.error('Error occurred while fetching movies:', err);
    return next(err);
  }
};
const order = async (req, res, next) => {
    try {
      const {user,product, quantity,totalAmount, orderDate } = req.body;
      const order = new Order({
        user,
        product,
        quantity,
        totalAmount,
        orderDate,
      });
  
      // Save the order to the database
      await order.save();
  
      res.status(201).json(order);
    } catch (err) {
      console.error('Error creating order:', err);
      res.status(500).json({ error: err.message });
    }
  };
  
 
  
  
  
  

const verifyOTP = async (req, res, next) => {
  const number=req.params.number;
  console.log(number)
  const { otp } = req.body;

console.log(number);
  if (!otp) {
    return res.status(400).json({ message: 'Please provide email and OTP' });
  }

  try {
    const user = await Signup.findOne({ otp }).maxTimeMS(30000); // Set timeout to 30 seconds (30000 milliseconds)

    if (!user) {    
      return res.status(404).json({ message: 'User not found' });
    }

   

    if (user.otp !== otp) {
      return res.status(401).json({ message: 'Invalid OTP' });
    }
    const verifyData = new verification({
      otp,
      userId: user._id
       // Assuming your user model has an "_id" field
    });

    await verifyData.save();

    // OTP verification successful
    // Add your further logic here (e.g., generating token, login the user, etc.)

    return res.status(200).json({ message: 'OTP verification successful' });
  } catch (err) {
    console.error('Error occurred during OTP verification:', err);
    return next(err);
  }
};



const sentOTP = async (req, res, next) => {
  const number = req.params.number;
  console.log(number);

  try {
    const otp = OTPGenerator.generate(6, { digits: true, alphabets: false, upperCase: false, specialChars: false });

    // Update the user's OTP in the database
    const updatedUser = await Signup.findOneAndUpdate(
      { number: number }, // Filter to find the user based on the phone number
      { otp }, // Update the user's OTP
      { new: true } // Return the updated document
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('New OTP generated:', otp);

    // Send OTP via SMS using FastSms2 API
    const apiKey = 'YOUR_FASTSMS2_API_KEY'; // Replace with your FastSms2 API key
    const fastSms2 = new FastSms2(apiKey);

    const smsResponse = await fastSms2.sendMessage({
      to: number,
      text: `Your OTP is: ${otp}`,
    });

    if (!smsResponse.success) {
      console.error('Error occurred while sending OTP:', smsResponse.error);
      return res.status(500).json({ message: 'Error sending OTP' });
    }

    // Send the OTP as the response along with the param value
    res.status(200).json({ message: 'OTP sent successfully', otp });
  } catch (error) {
    console.error('Error occurred while sending OTP:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
 // Import the jsonwebtoken library

 const login = async (req, res, next) => {
  const jwtSecret = "jwt"; // Replace with your own secret key
  console.log('Login request received');
  const { number, password } = req.body; // Assuming "name" is used for username

  try {
    if (number === '9925437458' && password === 'purv123') {
      // If number and password match, consider it an admin login
      // Generate an admin token
      const adminToken = jwt.sign({ role: 'admin' }, jwtSecret, { expiresIn: '1h' });
    
      // Send a JSON response with the admin token
      return res.status(200).json({ token: adminToken, redirectTo: '/admin-dashboard' });
    }

    // If the name and password do not match admin credentials, continue with regular user login
    const user = await Signup.findOne({ number }, '-otp'); // Exclude the otp field from the query

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    // Generate a user token
    const userToken = jwt.sign({ userId: user._id, role: 'user' }, jwtSecret, { expiresIn: '1h' });

    const loginData = new Login({
      number,
      userId: user._id,
    });

    await loginData.save();
    
    // Set the user token in localStorage
   

    // Send the token in the JSON response to the frontend for regular users
    return res.status(201).json({ token: userToken, message: 'Login successful!' });
  } catch (err) {
    console.error('Error occurred during login:', err);
    return next(err);
  }
};


  function verificationToken(req, res, next) {
    const beartoken = req.headers['authorization'];

    if (typeof beartoken !== 'undefined') {
        const bearer = beartoken.split(' ');
        req.token = bearer[1];

        jwt.verify(req.token,"token", (err, authData) => {
            if (err) {
                console.log('Token:', req.token); // Print the token
                res.sendStatus(403); // Return a forbidden status
            } else {
                // Store the token in a server-side variable or session if needed
                // For example, store the verified data
              console.log('Token:');
                next();
            }
        });
    } else {
        res.sendStatus(401); // Return an unauthorized status
    }
  }
  const Profile = async (req, res) => {
  try {
    const profileData = req.body;
    const profile = new Profiles(profileData);
    await profile.save();
    res.status(201).json(profile);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateProfileByUserId = async (req, res) => {
  try {
    const userId = req.params.userId;
    const updates = req.body;

    // Use findByIdAndUpdate to find the profile by user ID and update it
    const updatedProfile = await Profiles.findByIdAndUpdate(userId, updates, {
      new: true, // To return the updated product
      runValidators: true, // To run model validation on the updated data
    });



    if (!updatedProfile) {
      // If the profile is not found, return a 404 response
      return res.status(404).json({ error: 'Profile not found' });
    }

    // Return the updated profile in the response
    res.json(updatedProfile);
  } catch (error) {
    // Handle any errors that may occur during the update process
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};



const verifylogin = async (req, res) => {
  res.send("hi");
}
const stripes = async (req, res, next) => {
  const { paymentMethodId } = req.body;

  try {
    // Create a payment intent using the payment method ID
    const paymentIntent = await stripe.paymentIntents.create({
      payment_method: paymentMethodId,
      amount: 1000, // Replace with the actual amount to charge (in cents or smallest currency unit)
      currency: 'usd', // Replace with your preferred currency
      confirm: true,
    });

    // Handle successful payment or error responses
    // You can customize the response as needed
    res.status(200).json({ message: 'Payment completed successfully!' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



module.exports = { signup, verifyOTP,login, sentOTP,getAllMovies,Products,stripes,verifylogin,verificationToken,Addres,order,Profile,buy,updateProfileByUserId
};
