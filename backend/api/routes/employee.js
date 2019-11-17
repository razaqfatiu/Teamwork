const express = require('express');
const { getEmployees, employeeSignIn } = require('../controllers/employee');
const { createArticle, editArticle, deleteArticle } = require('../controllers/article');
const { createComment } = require('../controllers/comment');
const { employeeAuth } = require('../middleware/employeeAuth');
const { createGif } = require('../controllers/gif');
const multer = require('../config/multerConfig');

const employeeRouter = express.Router();

employeeRouter.get('/', getEmployees);
employeeRouter.post('/auth/signin', employeeSignIn);
employeeRouter.post('/articles', employeeAuth, createArticle);
employeeRouter.patch('/articles/:id', employeeAuth, editArticle);
employeeRouter.delete('/articles/:id', employeeAuth, deleteArticle);

employeeRouter.post('/articles/:articleId/comment', employeeAuth, createComment);

employeeRouter.post('/gifs', employeeAuth, multer, createGif);

module.exports = employeeRouter;
