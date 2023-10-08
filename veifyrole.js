const jwt = require('jsonwebtoken');

// Middleware function to verify the user's role
const verifyRole = (requiredRole) => {
  return (req, res, next) => {
    // Get the JWT token from the request headers or wherever you're storing it
    const token = req.headers.authorization;
   console.log(token)
    // Check if the token is present
    if (!token) {
      return res.status(401).json({ message: 'Token not provided' });
    }
const secretKey='your';
    try {
      const decoded = jwt.verify(token, secretKey);
    console.log("1")
      // Check if the token has expired
      const currentTimestamp = Math.floor(Date.now() / 1000);
      if (decoded.exp && decoded.exp < currentTimestamp) {
        console.log('Token has expired');
        console.log("2")
      } else {
        // Token is valid, you can access the role and other claims here
        const userRole = decoded.role;
        console.log('User role:', userRole);
        console.log("3")
      }
    } catch (error) {
      console.log("4")
      console.error('Token verification failed:', error.message);
    }
  };
};

module.exports = verifyRole;
