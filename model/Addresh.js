const mongoose = require('mongoose');

const AddressSchema = new mongoose.Schema({
  country: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  streetAddress: {
    type: String,
    required: true,
  },
  pincode: {
    type: String, // You can use String or Number based on your use case
    required: true,
  },
});

// Create the Address model
const Address = mongoose.model('Address', AddressSchema);

module.exports = Address;
