const mongoose = require('mongoose');

// Define the order schema
const orderSchema = new mongoose.Schema({
  // Add the fields you need for an order
   user: {
        type: Number,
        // Make sure this is set to true
    },
      product: {
        type: String,
        ref: 'Product', // Reference to the product in the order
        // required: true,
      },
      quantity: {
        type: Number,
        // required: true,
      },
      
  totalAmount: {
    type: Number,
    // required: true,
  },
  status: {
    type: String,
    enum: ['Pending', 'Return', 'Cancel'],
    default: 'Pending',
  },
  image: {
    type: String,
   
  },
  // Add any other fields you need for your order model
}, { timestamps: true }); // Add timestamps for createdAt and updatedAt

// Create the order model
const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
