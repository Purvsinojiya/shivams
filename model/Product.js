

const mongoose = require('mongoose');


const ProductSchema = new mongoose.Schema({
  imageUrl: {
    type: String,
    required: true,
  },
  productName: {
    type: String,
    required: true,
  },
  productPrice: {
    type: Number,
    required: true,
  },
  productDescription: {
    type: String,
    required: true,
  },
  sellerplace: {
    type: String,
    required: true,
  },
  Queinty: {
    type: Number,
    required: true,
  },
});

// Create the Product model
const Product = mongoose.model('Product', ProductSchema);

module.exports = Product;
