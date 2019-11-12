require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { pool } = require('../db/config');

module.exports = {
  getAdmin(req, res) {
    res.status(200).json({ admin: 'Admins' });
  },
  adminSignin(req, res) {
    const { email, password } = req.body;
    const query = {
      text: 'SELECT * FROM admin where email = $1',
      values: [email],
    };

    // eslint-disable-next-line consistent-return
    return pool.query(query).then((admin) => {
      if (!admin) {
        return res.status(401).json({
          error: new Error('Admin not found'),
        });
      }
      const { rows } = admin;
      bcrypt.compare(password, rows[0].password)
        // eslint-disable-next-line consistent-return
        .then((valid) => {
          if (!valid) {
            return res.status(401).json({
              error: new Error('Incorrect email or password'),
            });
          }
          const token = jwt.sign(
            { adminId: rows[0].id },
            process.env.TOKEN_SECRET,
            { expiresIn: '1h' },
          );
          res.status(200).json({
            // eslint-disable-next-line no-underscore-dangle
            adminId: rows[0].id,
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
