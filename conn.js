const mongoose = require('mongoose');
const DB = 'mongodb+srv://Shivam_enterprise:1234567890@cluster0.mmutnua.mongodb.net/<database>?retryWrites=true&w=majority'; // Replace with your MongoDB connection string

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