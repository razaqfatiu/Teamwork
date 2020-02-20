/* eslint-disable consistent-return */
const { body, validationResult } = require('express-validator');
const { pool } = require('../db/config');

module.exports = {
  articleInputValidation: [
    body('title', 'Title field cannot be empty').trim()
      .not().isEmpty(),
    body('article', 'Article cannot be empty').trim()
      .not()
      .isEmpty(),
  ],
  createArticle(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    const { title, article } = req.body;
    const authorId = req.user.id;
    const newArticle = {
      name: 'newArticle',
      text: 'INSERT INTO article (title, article, author_id) VALUES ($1, $2, $3)  RETURNING *',
      values: [title, article, authorId],
    };

    return pool.query(newArticle).then((response) => {
      const { rows } = response;
      const { id } = rows[0];
      const createdOn = new Date(rows[0].created_at);
      return res.status(201).json({
        message: 'Article successfully posted',
        articleId: id,
        createdOn,
        title: rows[0].title,
      });
    })
      .catch((error) => {
        res.status(500).json({ error });
      });
  },
  editArticle(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    const { title, article } = req.body;
    const { articleId } = req.params;
    const { isAdmin, id: signedInUser } = req.user;
    const getArticleInfo = {
      name: 'getArticleInfo',
      text: 'SELECT author_id FROM article WHERE id=$1',
      values: [articleId],
    };

    pool.query(getArticleInfo).then((data) => {
      const { rows } = data;
      const author = rows[0].author_id;
      if (rows.length === 0) {
        return res.status(404).json({
          error: 'Cannot find Article',
        });
      }
      if (!isAdmin && author !== signedInUser) {
        return res.status(401).json({
          message: 'You are not authorized to edit this article',
        });
      }
      const updateArticle = {
        name: 'updateArticle',
        text: 'UPDATE article SET title = $1, article = $2 WHERE id=$3 RETURNING *',
        values: [title, article, articleId],
      };
      return pool.query(updateArticle)
        .then((response) => {
          const { rows: row } = response;
          return res.status(201).json({
            message: 'Article successfully updated',
            title: row[0].title,
            article: row[0].article,
          });
        })
        .catch((error) => res.status(400).json({
          error,
        }));
    })
      .catch((error) => res.status(500).json({
        error,
      }));
  },
  deleteArticle(req, res) {
    const { articleId } = req.params;
    const { isAdmin, id: signedInUser } = req.user;
    const getArticleInfo = {
      name: 'getArticleInfo',
      text: 'SELECT author_id FROM article WHERE id=$1',
      values: [articleId],
    };

    pool.query(getArticleInfo).then((data) => {
      const { rows } = data;
      const author = rows[0].author_id;
      if (rows.length < 1) return res.status(404).json({ error: 'Not Found' });
      if (!isAdmin && author !== signedInUser) {
        return res.status(401).json({
          message: 'You are not authorized to delete this article',
        });
      }
      const deleteArticle = {
        name: 'deleteArticle',
        text: 'DELETE FROM article WHERE id = $1',
        values: [articleId],
      };
      return pool.query(deleteArticle).then(() => {
        res.status(200).json({ message: 'Article Successfully deleted' });
      })
        .catch((error) => {
          res.status(400).json({ error });
        });
    })
      .catch((error) => { res.status(500).json({ error }); });
  },
  getOneArticle(req, res) {
    const { articleId } = req.params;
    const selectArticle = {
      name: 'selectArticle',
      text: 'SELECT * FROM article WHERE id=$1',
      values: [articleId],
    };
    const selectComment = {
      name: 'selectComment',
      text: `SELECT id as "commentId", comment,
              author_id as "authorId" FROM article_comment WHERE article_id=$1`,
      values: [articleId],
    };
    pool.query(selectComment).then((response) => pool.query(selectArticle).then((result) => {
      const { rows } = result;
      if (rows.length < 1) return res.status(404).json({ error: 'Not Found' });

      return res.status(200).json({
        id: rows[0].id,
        createdOn: rows[0].created_at,
        title: rows[0].title,
        article: rows[0].article,
        comments: response.rows,
      });
    })
      .catch((error) => res.status(400).json({ error })))
      .catch((error) => res.status(500).json({ error }));
  },
};
