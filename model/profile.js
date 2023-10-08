const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
    user: {
        type: String,
        required: true,
        unique: true,
      },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  dateOfBirth: {
    type: Date,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
  },
  address: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Address', // Reference to the Address model (if applicable)
  },
  // Other profile information can be added here
  // ...
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Profile = mongoose.model('Profile', profileSchema);

module.exports = Profile;
