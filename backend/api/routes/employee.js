const express = require('express');
const { getEmployees, employeeSignIn } = require('../controllers/employee');
const { createArticle, editArticle, deleteArticle } = require('../controllers/article');
const { createComment } = require('../controllers/comment');
const { employeeAuth } = require('../middleware/employeeAuth');

const employeeRouter = express.Router();

employeeRouter.get('/', getEmployees);
employeeRouter.post('/auth/signin', employeeSignIn);
employeeRouter.post('/articles', employeeAuth, createArticle);
employeeRouter.patch('/articles/:id', employeeAuth, editArticle);
employeeRouter.delete('/articles/:id', employeeAuth, deleteArticle);

employeeRouter.post('/articles/:articleId/comment', employeeAuth, createComment);

module.exports = employeeRouter;
