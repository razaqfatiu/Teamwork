const express = require('express');
// const { getAdmin, adminCreateUser } = require('../controllers/admin');
const { userSignIn, adminCreateUser } = require('../controllers/user');
const { userAuth } = require('../middleware/userAuth');
// const { employeeAuth } = require('../middleware/employeeAuth');
const { createArticle, editArticle } = require('../controllers/article');
// const { createComment, createGifComment } = require('../controllers/comment');
// const { getFeeds } = require('../controllers/feed');
// const { createGif, getOneGif, deleteGif } = require('../controllers/gif');
// const multer = require('../config/multerConfig');

const userRouter = express.Router();

userRouter.post('/auth/signin', userSignIn);
userRouter.post('/auth/create-user', userAuth, adminCreateUser);
userRouter.post('/articles', userAuth, createArticle);
userRouter.patch('/articles/:articleId', userAuth, editArticle);


module.exports = userRouter;
