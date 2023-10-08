const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OTPVerificationSchema = new Schema({
 
  otp: {
    type: String,
    required: true
  },
 
});

const OTPVerification = mongoose.model('OTPVerification', OTPVerificationSchema);

module.exports = OTPVerification;
