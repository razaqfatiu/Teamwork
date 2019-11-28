require('dotenv').config();
const jwt = require('jsonwebtoken');

module.exports = {
  userAuth(req, res, next) {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decoedToken = jwt.verify(token, process.env.EMPLOYEE_TOKEN_SECRET);
      const { userId, isAdmin } = decoedToken;
      req.user = { id: userId, isAdmin, token };
      if (req.body.userId && req.body.userId !== userId) {
        // eslint-disable-next-line no-throw-literal
        return res.status(401).json({ message: 'Invalid User' });
      }
      return next();
    } catch (error) {
      res.status(401).json({
        error: 'Invaid request',
      });
    }
    return true;
  },
};
