const express = require('express');
const { userSignIn, adminCreateUser } = require('../controllers/user');
const { userAuth } = require('../middleware/userAuth');
const { createArticle, editArticle } = require('../controllers/article');


const userRouter = express.Router();

userRouter.post('/auth/signin', userSignIn);
userRouter.post('/auth/create-user', userAuth, adminCreateUser);
userRouter.post('/articles', userAuth, createArticle);
userRouter.patch('/articles/:articleId', userAuth, editArticle);


module.exports = userRouter;
