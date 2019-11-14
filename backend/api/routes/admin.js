// const { pool } = require('../db/config')
const express = require('express');
const { getAdmin, adminSignin, adminCreateUser } = require('../controllers/admin');
// const adminSignin = require('../controllers/admin');
const { adminAuth } = require('../middleware/adminAuth');

const adminRouter = express.Router();

adminRouter.get('/', adminAuth, getAdmin);
adminRouter.post('/auth/signin', adminSignin);
adminRouter.post('/auth/create-user', adminAuth, adminCreateUser);


module.exports = adminRouter;
