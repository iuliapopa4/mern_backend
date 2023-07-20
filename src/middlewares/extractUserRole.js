const jwt = require('jsonwebtoken');
const { secretKey } = require('../config/config');

const extractUserRole = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authorization token not found' });
  }

  const token = authHeader.split(' ')[1];

  console.log('Token before verification:', token);

  try {
    const decoded = jwt.verify(token, secretKey);
    req.userRole = decoded.roles || ['invite'];
    next();
  } catch (error) {
    console.log('Error verifying token:', error);
    return res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = extractUserRole;
