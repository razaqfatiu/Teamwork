// const { pool } = require('../db/config')
const express = require('express');
const { getAdmin, adminSignin } = require('../controllers/admin');
// const adminSignin = require('../controllers/admin');
const { adminAuth } = require('../middleware/adminAuth');

const adminRouter = express.Router();

adminRouter.get('/', adminAuth, getAdmin);
adminRouter.post('/auth/signin', adminSignin);


module.exports = adminRouter;
