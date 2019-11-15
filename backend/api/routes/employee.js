const express = require('express');
const { getEmployees, employeeSignIn } = require('../controllers/employee');
const { createArticle } = require('../controllers/article');
const { employeeAuth } = require('../middleware/employeeAuth');

const employeeRouter = express.Router();

employeeRouter.get('/', getEmployees);
employeeRouter.post('/auth/signin', employeeSignIn);
employeeRouter.post('/articles', employeeAuth, createArticle);

module.exports = employeeRouter;
