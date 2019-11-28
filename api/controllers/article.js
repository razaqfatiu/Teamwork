const { pool } = require('../db/config');

module.exports = {
  createArticle(req, res) {
    const { title, article } = req.body;
    const authorId = req.user.id;
    const newArticle = {
      name: 'newArticle',
      text: 'INSERT INTO article (title, article, author_id) VALUES ($1, $2, $3)  RETURNING *',
      values: [title, article, authorId],
    };

    pool.query(newArticle).then((response) => {
      const { rows } = response;
      const { id } = rows[0];
      const createdOn = new Date(rows[0].created_at);
      res.status(201).json({
        message: 'Article successfully posted',
        articleId: id,
        createdOn,
        title: rows[0].title,
      });
    })
      .catch((error) => {
        res.status(400).json({ error });
      });
  },
};