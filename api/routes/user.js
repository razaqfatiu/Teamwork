const express = require('express');
const { userSignIn, adminCreateUser } = require('../controllers/user');
const { userAuth } = require('../middleware/userAuth');
const { createArticle, editArticle, deleteArticle } = require('../controllers/article');
const { createGif } = require('../controllers/gif');
const multer = require('../config/multerConfig');

const userRouter = express.Router();

userRouter.post('/auth/signin', userSignIn);
userRouter.post('/auth/create-user', userAuth, adminCreateUser);
userRouter.post('/articles', userAuth, createArticle);
userRouter.patch('/articles/:articleId', userAuth, editArticle);
userRouter.delete('/articles/:articleId', userAuth, deleteArticle);
userRouter.post('/gifs', userAuth, multer, createGif);


module.exports = userRouter;
