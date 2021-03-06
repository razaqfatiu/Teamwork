require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const { pool } = require('../db/config');


module.exports = {
  userInputValidation: [
    body('firstname', 'Firstname field cannot be empty').trim()
      .not().isEmpty(),
    body('lastname', 'Last Namefield cannot be empty').trim()
      .not()
      .isEmpty(),
    body('email', 'Enter a valid email').isEmail().trim()
      .not()
      .isEmpty(),
    body('password', 'Password cannot be empty and requires at least 6 character')
      .isLength({ min: 3 }).trim()
      .not()
      .isEmpty(),
    body('gender', 'gender field cannot be empty').trim()
      .not()
      .isEmpty(),
    body('jobrole', 'jobrole field cannot be empty').trim()
      .not()
      .isEmpty(),
    body('department', 'department field cannot be empty').trim()
      .not()
      .isEmpty(),
    body('address', 'address field cannot be empty').trim()
      .not()
      .isEmpty(),
  ],
  userSignIn(req, res) {
    const { email, password } = req.body;
    const query = {
      text: 'SELECT * FROM users where email = $1',
      values: [email],
    };

    return pool.query(query).then((user) => {
      const { rows } = user;
      if (rows.length === 0) {
        return res.status(401).json({
          error: 'User not found',
        });
      }
      return bcrypt.compare(password, rows[0].password)
        // eslint-disable-next-line consistent-return
        .then((valid) => {
          if (!valid) {
            return res.status(401).json({
              error: 'Incorrect email or password',
            });
          }
          if (rows[0].isadmin) {
            const token = jwt.sign(
              { userId: rows[0].id, isAdmin: true },
              process.env.EMPLOYEE_TOKEN_SECRET,
              { expiresIn: '1h' },
            );
            return res.status(200).json({
              userId: rows[0].id,
              token,
            });
          }
          const token = jwt.sign(
            { userId: rows[0].id, isAdmin: false },
            process.env.EMPLOYEE_TOKEN_SECRET,
            { expiresIn: '1h' },
          );
          return res.status(200).json({
            userId: rows[0].id,
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
  // eslint-disable-next-line consistent-return
  adminCreateUser(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    const {
      firstname, lastname, email, password, gender, jobrole, department, address,
    } = req.body;
    const userId = req.user.id;
    const { isAdmin } = req.user;
    const checkIfuserExists = {
      name: 'checkIfNewuserExists',
      text: 'SELECT * FROM users WHERE email = $1',
      values: [email],
    };
    pool.query(checkIfuserExists).then((result) => {
      const { rows } = result;
      if (rows.length > 0) {
        return res.status(400).json({
          error: 'User has an existing account',
        });
      }
      if (!isAdmin) {
        return res.status(404).json({
          error: 'Only Admins can create employee accounts',
        });
      }
      return bcrypt.hash(password, 10).then((hash) => {
        const insertNewEmployee = {
          name: 'insertNewEmployee',
          text: `INSERT INTO users(
          firstname, lastname, email, password, gender, jobrole, department, address, isadmin
          ) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
          values: [firstname, lastname, email, hash, gender, jobrole, department, address, false],
        };
        pool.query(insertNewEmployee)
          .then(() => res.status(201).json({
            message: 'User Account successfully created',
            userId,
          }))
          .catch((error) => res.status(500).json({ error }));
      });
    })
      .catch((error) => res.status(500).json({ error }));
  },

};
