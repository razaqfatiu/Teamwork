const express = require('express');
const { userSignIn, adminCreateUser } = require('../controllers/user');
const { userAuth } = require('../middleware/userAuth');
const {
  createArticle, editArticle, deleteArticle, getOneArticle,
} = require('../controllers/article');
const { createGif, deleteGif, getOneGif } = require('../controllers/gif');
const { createArticleComment, createGifComment } = require('../controllers/comment');
const multer = require('../config/multerConfig');

const userRouter = express.Router();

userRouter.post('/auth/signin', userSignIn);
userRouter.post('/auth/create-user', userAuth, adminCreateUser);
userRouter.post('/articles', userAuth, createArticle);
userRouter.patch('/articles/:articleId', userAuth, editArticle);
userRouter.delete('/articles/:articleId', userAuth, deleteArticle);
userRouter.post('/gifs', userAuth, multer, createGif);
userRouter.delete('/gifs/:gifId', userAuth, deleteGif);
userRouter.post('/articles/:articleId/comment', userAuth, createArticleComment);
userRouter.post('/gifs/:gifId/comment', userAuth, createGifComment);
userRouter.get('/articles/:articleId', userAuth, getOneArticle);
userRouter.get('/gifs/:gifId', userAuth, getOneGif);


module.exports = userRouter;
