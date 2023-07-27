const jwt = require('jsonwebtoken');
const { secretKey } = require('../config/config');
const User = require('../models/userModel');

const authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: 'Authorization token not found' });
  }

  try {
    const decoded = jwt.verify(token, secretKey);
    console.log('Decoded Token:', decoded); 

    if (!decoded.userId) {
      return res.status(401).json({ message: 'Invalid token. Missing userId' });
    }

    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    req.user = {
      roles: user.roles,
      name: user.name,
    };

    next();
  } catch (error) {
    console.error('Token Verification Error:', error); 
    return res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = authMiddleware;
