require('dotenv').config();
const jwt = require('jsonwebtoken');

exports.employeeAuth = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decoedToken = jwt.verify(token, process.env.EMPLOYEE_TOKEN_SECRET);
    const { employeeId } = decoedToken;
    req.employee = { id: employeeId, token };
    if (req.body.employeeId && req.body.employeeId !== employeeId) {
      res.status(401).json({ message: 'Invalid User' });
    } else {
      next();
    }
  } catch (error) {
    res.status(401).json({
      error: 'Invaid request',
    });
  }
};
