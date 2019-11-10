const express = require('express');
const { getEmployees } = require('../controllers/employee');

const employeeRouter = express.Router();

employeeRouter.get('/', getEmployees);

module.exports = employeeRouter;
