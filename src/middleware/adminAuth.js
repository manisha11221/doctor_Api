const authmodel = require("../model/admin.model");
const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ success: false, message: 'Unauthorized: Missing token' });
  }

  jwt.verify(token.replace('Bearer ', ''), 'admin-token', (err, decoded) => {
    if (err) {
      return res.status(403).json({ success: false, message: 'Forbidden: Invalid token' });
    }

    req.user = decoded;
    next();
  });
};

module.exports = authenticateToken;