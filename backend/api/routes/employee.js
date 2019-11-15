const express = require('express');
const { getEmployees, employeeSignIn } = require('../controllers/employee');
const { createArticle, editArticle } = require('../controllers/article');
const { employeeAuth } = require('../middleware/employeeAuth');

const employeeRouter = express.Router();

employeeRouter.get('/', getEmployees);
employeeRouter.post('/auth/signin', employeeSignIn);
employeeRouter.post('/articles', employeeAuth, createArticle);
employeeRouter.patch('/articles/:id', employeeAuth, editArticle);

module.exports = employeeRouter;
