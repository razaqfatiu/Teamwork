/* eslint-disable consistent-return */
const { body, validationResult } = require('express-validator');
const { pool } = require('../db/config');

module.exports = {
  commentInputValidation: [
    body('comment', 'Comment field cannot be empty').trim()
      .not().isEmpty(),
  ],
  createArticleComment(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    const { comment } = req.body;
    const { articleId } = req.params;
    const { id: userId } = req.user;

    const insertComment = {
      name: 'insertComment',
      text: 'INSERT INTO article_comment (comment, article_id, author_id) VALUES ($1, $2, $3) RETURNING *',
      values: [comment, articleId, userId],
    };

    pool.query(insertComment).then((response) => {
      const { rows } = response;
      const selectArticle = {
        name: 'selectArticle',
        text: 'SELECT * FROM article WHERE id=$1',
        values: [rows[0].article_id],
      };

      return pool.query(selectArticle).then((articleResponse) => res.status(201).json({
        message: 'comment successfully created',
        createdOn: rows[0].created_at,
        articleTitle: articleResponse.rows[0].title,
        article: articleResponse.rows[0].article,
        comment: rows[0].comment,
      }))
        .catch((error) => res.status(400).json({ error }));
    })
      .catch((error) => res.status(500).json({ error }));
  },
  createGifComment(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    const { comment } = req.body;
    const { gifId } = req.params;
    const { id: userId } = req.user;
    const insertComment = {
      name: 'insertComment',
      text: 'INSERT INTO gif_comment (comment, gif_id, author_id) VALUES ($1, $2, $3) RETURNING *',
      values: [comment, gifId, userId],
    };

    pool.query(insertComment).then((response) => {
      const { rows } = response;
      const selectGif = {
        name: 'selectGif',
        text: 'SELECT * FROM gif WHERE id=$1',
        values: [rows[0].gif_id],
      };

      pool.query(selectGif).then((gifResponse) => {
        const createdOn = new Date(rows[0].created_at);
        res.status(201).json({
          message: 'comment successfully created',
          createdOn,
          gifTitle: gifResponse.rows[0].title,
          comment: rows[0].comment,
        });
      })
        .catch((error) => {
          res.status(400).json({ error });
        });
    })
      .catch((error) => {
        res.status(500).json({ error });
      });
  },
};
