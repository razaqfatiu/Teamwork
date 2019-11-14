require('dotenv').config();
const jwt = require('jsonwebtoken');

exports.adminAuth = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decoedToken = jwt.verify(token, process.env.TOKEN_SECRET);
    const { adminId } = decoedToken;
    req.admin = { id: adminId, token };
    if (req.body.adminId && req.body.adminId !== adminId) {
      res.status(401).json({ message: 'Invalid User' });
    } else {
      next();
    }
  } catch (error) {
    res.status(401).json({
      error: new Error('Invaid request'),
    });
  }
};
