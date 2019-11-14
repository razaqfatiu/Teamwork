const express = require('express');
const { getEmployees, employeeSignIn } = require('../controllers/employee');

const employeeRouter = express.Router();

employeeRouter.get('/', getEmployees);
employeeRouter.post('/auth/signin', employeeSignIn);

module.exports = employeeRouter;
