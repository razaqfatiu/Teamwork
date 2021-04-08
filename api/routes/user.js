const express = require('express');
const { userSignIn, adminCreateUser, userInputValidation } = require('../controllers/user');
const { userAuth } = require('../middleware/userAuth');
const {
  createArticle, editArticle, deleteArticle, getOneArticle, articleInputValidation,
} = require('../controllers/article');
const {
  createGif, deleteGif, getOneGif, gifInputValidation,
} = require('../controllers/gif');
const { createArticleComment, createGifComment, commentInputValidation } = require('../controllers/comment');
const { getFeeds } = require('../controllers/feed');
const multer = require('../config/multerConfig');

const userRouter = express.Router();

userRouter.post('/auth/signin', userSignIn);
userRouter.post('/auth/create-user', userAuth, userInputValidation, adminCreateUser);
userRouter.post('/articles', userAuth, articleInputValidation, createArticle);
userRouter.patch('/articles/:articleId', userAuth, articleInputValidation, editArticle);
userRouter.delete('/articles/:articleId', userAuth, deleteArticle);
userRouter.post('/gifs', userAuth, multer, gifInputValidation, createGif);
userRouter.delete('/gifs/:gifId', userAuth, deleteGif);
userRouter.post('/articles/:articleId/comment', userAuth, commentInputValidation, createArticleComment);
userRouter.post('/gifs/:gifId/comment', userAuth, commentInputValidation, createGifComment);
userRouter.get('/articles/:articleId', userAuth, getOneArticle);
userRouter.get('/feed', userAuth, getFeeds);
userRouter.get('/gifs/:gifId', userAuth, getOneGif);


module.exports = userRouter;
