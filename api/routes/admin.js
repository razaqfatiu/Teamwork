const express = require('express');
const { getAdmin, adminCreateUser } = require('../controllers/admin');
const { userSignIn } = require('../controllers/user');
const { adminAuth } = require('../middleware/adminAuth');

const adminRouter = express.Router();

adminRouter.get('/', adminAuth, getAdmin);
adminRouter.post('/auth/signin', userSignIn);
adminRouter.post('/auth/create-user', adminAuth, adminCreateUser);


module.exports = adminRouter;
