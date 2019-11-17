const express = require('express');
const { getEmployees, employeeSignIn } = require('../controllers/employee');
const { createArticle, editArticle, deleteArticle } = require('../controllers/article');
const { createComment, createGifComment } = require('../controllers/comment');
const { employeeAuth } = require('../middleware/employeeAuth');
const { createGif, deleteGif } = require('../controllers/gif');
const multer = require('../config/multerConfig');

const employeeRouter = express.Router();

employeeRouter.get('/', getEmployees);
employeeRouter.post('/auth/signin', employeeSignIn);
employeeRouter.post('/articles', employeeAuth, createArticle);
employeeRouter.patch('/articles/:id', employeeAuth, editArticle);
employeeRouter.delete('/articles/:id', employeeAuth, deleteArticle);

employeeRouter.post('/articles/:articleId/comment', employeeAuth, createComment);

employeeRouter.post('/gifs', employeeAuth, multer, createGif);
employeeRouter.delete('/gifs/:id', employeeAuth, deleteGif);
employeeRouter.post('/gifs/:gifId/comment', employeeAuth, createGifComment);

module.exports = employeeRouter;
