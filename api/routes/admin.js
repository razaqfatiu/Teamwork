const express = require('express');
const { getAdmin, adminCreateUser } = require('../controllers/admin');
const { userSignIn } = require('../controllers/user');
const { adminAuth } = require('../middleware/adminAuth');
const { employeeAuth } = require('../middleware/employeeAuth');
const {
  createArticle, editArticle, deleteArticle, getOneArticle,
} = require('../controllers/article');
const { createComment, createGifComment } = require('../controllers/comment');
const { getFeeds } = require('../controllers/feed');
const { createGif, getOneGif, deleteGif } = require('../controllers/gif');
const multer = require('../config/multerConfig');

const adminRouter = express.Router();

adminRouter.get('/', adminAuth, getAdmin);
adminRouter.post('/auth/signin', userSignIn);
adminRouter.post('/auth/create-user', adminAuth, adminCreateUser);
adminRouter.post('/articles', adminAuth, createArticle);
adminRouter.patch('/articles/:id', adminAuth, editArticle);
adminRouter.delete('/articles/:id', adminAuth, deleteArticle);
adminRouter.post('/articles/:articleId/comment', adminAuth, createComment);
adminRouter.post('/gifs', adminAuth || employeeAuth, multer, createGif);
adminRouter.delete('/gifs/:id', adminAuth, deleteGif);
adminRouter.post('/gifs/:gifId/comment', adminAuth, createGifComment);

adminRouter.get('/articles/:articleId', adminAuth, getOneArticle);
adminRouter.get('/gifs/:gifId', adminAuth, getOneGif);

adminRouter.get('/feed', adminAuth, getFeeds);

module.exports = adminRouter;
