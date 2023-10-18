require('dotenv').config(); 
const mongoose = require('mongoose');
const DB = process.env.DB_CONNECTION_STRING;

mongoose.connect(DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Connection to MongoDB successful');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB', error);
  });