const express = require('express');
const app = express();
const Signup = require('../model/Singup.js');
const Login = require('../model/Login.js');
const verification = require('../model/verification.js');
const bcrypt = require('bcryptjs');
const OTPGenerator = require('otp-generator');
const Product = require('../model/Product.js');
const Order = require('../model/order.js');
const Stock = require('../model/stock.js')

const addProduct = async (req, res, next) => {
    try {
      const product = new Product(req.body);
      await product.save();
      res.status(201).json(product);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  };


  const getAllProduct = async (req, res, next) => {
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

  const deleteProduct = async (req, res, next) => {
    try {
      const productId = req.params.productId;
      console.log('Deleting product with ID:', productId);
  
      const deletedProduct = await Product.findByIdAndDelete(productId);
  
      if (!deletedProduct) {
        console.log('Product not found');
        return res.status(404).json({ error: "Product not found" });
      }
  
      res.status(204).send();
    } catch (err) {
      console.error('Error deleting product:', err);
      res.status(500).json({ error: err.message });
    }

  };

  const updateProduct = async (req, res, next) => {
    try {
      const productId = req.params.productId;
      const updateData = req.body; // Data to update the product
  
      // Use findByIdAndUpdate to update the product by ID
      const updatedProduct = await Product.findByIdAndUpdate(productId, updateData, {
        new: true, // To return the updated product
        runValidators: true, // To run model validation on the updated data
      });
  
      if (!updatedProduct) {
        return res.status(404).json({ error: "Product not found" });
      }
  
      res.status(200).json(updatedProduct);
    } catch (err) {
      console.error('Error updating product:', err);
      res.status(500).json({ error: err.message });
    }
  };
  const getAllUsers = async (req, res, next) => {
    try {
      // Assuming you have a User model, use it to fetch all users
      const users = await Signup.find();
  
      res.status(200).json(users);
    } catch (err) {
      console.error('Error fetching users:', err);
      res.status(500).json({ error: err.message });
    }
  };
  const returnOrder = async (req, res, next) => {
    try {
      const orderId = req.params.orderId;
  
      // Check if the order with the given orderId exists
      const order = await Order.findById(orderId);
  
      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }
  
      // Check if the order is already canceled
      if (order.status === 'return') {
        return res.status(400).json({ error: 'Order is already return' });
      }
  
      // Update the order status to "canceled"
      order.status = 'return';
      await order.save();
  
      res.status(200).json({ message: 'Order return successfully' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };


  const cancelOrder = async (req, res) => {
    try {
      const orderId = req.params.orderId;
  
      // Check if the order with the given orderId exists
      const order = await Order.findById(orderId);
  
      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }
  
      // Check if the order is already canceled
      if (order.status === 'canceled') {
        return res.status(400).json({ error: 'Order is already canceled' });
      }
  
      // Update the order status to "canceled"
      order.status = 'canceled';
      await order.save();
  
      res.status(200).json({ message: 'Order canceled successfully' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };

  
  
  
  const allorder = async (req, res, next) => {
    try {
      const orders = await Order.find();
      res.status(200).json(orders);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  const allstock = async (req, res, next) => {
    try {
      const stocks = await Stock.find();
      res.status(200).json(stocks);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  
  
  const stockadd = async (req, res, next) => {
    const { productName,addquantity, sellerName } = req.body;
  
    try {
      let stockEntry = await Stock.findOne({ productName });
  
      if (!stockEntry) {
        // If the product doesn't exist, create a new entry
        stockEntry = new Stock({
          productName,
          addquantity,
          currentStock:addquantity, // Set the initial currentStock as addquantity
          sellerName, // Set the seller name as needed
        });
      } else {
        // If the product exists, update the quantity and currentStock
     
        stockEntry.currentStock += addquantity;
      }
  
      await stockEntry.save();
      
      // Send a response with the updated stockEntry
      res.status(200).json({ message: 'Successfully updated stock', stockEntry });
    } catch (error) {
      console.error("Error updating stock:", error);
      res.status(500).json({ message: 'Error updating stock', error });
    }
  }
  
  
  module.exports = {addProduct,getAllProduct,deleteProduct,updateProduct,getAllUsers,cancelOrder,returnOrder,allorder,stockadd,allstock};