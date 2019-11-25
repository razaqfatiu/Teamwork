require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { pool } = require('../db/config');


module.exports = {
  getEmployees(req, res) {
    res.status(200);
    res.json({ employees: 'employees' });
  },
  employeeSignIn(req, res) {
    const { email, password } = req.body;
    const query = {
      text: 'SELECT * FROM employee where email = $1',
      values: [email],
    };

    return pool.query(query).then((employee) => {
      const { rows } = employee;
      if (rows.length === 0) {
        return res.status(401).json({
          error: 'Employee not found',
        });
      }
      return bcrypt.compare(password, rows[0].password)
        .then((valid) => {
          if (!valid) {
            return res.status(401).json({
              error: 'Incorrect email or password',
            });
          }
          const token = jwt.sign(
            { employeeId: rows[0].id },
            process.env.EMPLOYEE_TOKEN_SECRET,
            { expiresIn: '1h' },
          );
          return res.status(200).json({
            employeeId: rows[0].id,
            token,
          });
        })
        .catch((error) => {
          res.status(500).json({
            error,
          });
        });
    })
      .catch((error) => {
        res.status(500).json({
          error,
        });
      });
  },
};
