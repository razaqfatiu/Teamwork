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

    return pool.query(query).then((admin) => {
      const { rows } = admin;
      if (rows.length === 0) {
        return res.status(401).json({
          error: 'Admin not found',
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
            { adminId: rows[0].id },
            process.env.TOKEN_SECRET,
            { expiresIn: '1h' },
          );
          return res.status(200).json({
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
  adminCreateUser(req, res) {
    const {
      firstname, lastname, email, password, gender, jobrole, department, address,
    } = req.body;
    const adminId = req.admin.id;
    const { token } = req.admin;
    const checkIfEmployeeExists = {
      name: 'checkIfNewEMployeeExists',
      text: 'SELECT * FROM employee WHERE email = $1',
      values: [email],
    };
    pool.query(checkIfEmployeeExists).then((result) => {
      const { rows } = result;
      if (rows.length > 0) {
        return res.status(400).json({
          error: 'Employee has an existing account',
        });
      }
      return bcrypt.hash(password, 10).then((hash) => {
        const insertNewEmployee = {
          name: 'insertNewEmployee',
          text: `INSERT INTO employee(
          firstname, lastname, email, password, gender, jobrole, department, address, adminid
          ) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
          values: [firstname, lastname, email, hash, gender, jobrole, department, address, adminId],
        };
        pool.query(insertNewEmployee)
          .then((response) => {
            res.status(201).json({
              message: 'Employee added successfully!!!',
              token,
              adminId,
            });
          })
          .catch((error) => {
            res.status(500).json({ error });
          });
      });
    })
      .catch((error) => {
        res.status(500).json({ error });
      });
  },

};
