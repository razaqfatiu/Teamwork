const express = require('express');
const { getAdmins } = require('../controllers/admin');

const adminRouter = express.Router();

adminRouter.get('/', getAdmins);

module.exports = adminRouter;
