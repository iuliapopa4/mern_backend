const isAdminMiddleware = (req, res, next) => {
  if (req.userRole.includes('admin')) { 
    next(); 
  } else {
    res.status(403).json({ message: 'Access denied' }); 
  }
};

module.exports = isAdminMiddleware;
