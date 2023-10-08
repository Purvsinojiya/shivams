const jwt = require('jsonwebtoken');
const  jwtSecret = 'jwt' // Import your secret key from a config file

const authMiddleware = (req, res, next) => {
  // Get the token from the request headers
  const token = req.header('Authorization');

  // Check if there's no token
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, jwtSecret);

    // Attach the user information to the request object
    req.user = decoded;

    // Continue to the next middleware or route handler
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = authMiddleware;
