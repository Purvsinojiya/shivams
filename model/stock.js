const mongoose = require('mongoose');

// Define the schema for the Stock model
const stockSchema = new mongoose.Schema({
  productName: {
    type: String,
    required: true,
  },
  addquantity: {
    type: Number,
    required: true,
  },
  sellerName: {
    type: String,
    required: true,
  },
  currentStock: {
    type: Number, // Change the data type to Number
    default: 0, // Change the data type to Number
  },
});

// Create the Stock model based on the schema
const Stock = mongoose.model('Stock', stockSchema);

module.exports = Stock;
