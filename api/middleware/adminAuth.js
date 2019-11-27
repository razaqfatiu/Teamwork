require('dotenv').config();
const jwt = require('jsonwebtoken');

exports.adminAuth = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decoedToken = jwt.verify(token, process.env.TOKEN_SECRET);
    const { adminId } = decoedToken;
    req.admin = { id: adminId, token };
    if (req.body.adminId && req.body.adminId !== adminId) {
      // eslint-disable-next-line no-throw-literal
      throw 'Invalid user id';
    } else {
      next();
    }
  } catch (error) {
    res.status(401).json({
      error: 'Invaid request',
    });
  }
};
