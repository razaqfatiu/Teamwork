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
  editArticle(req, res) {
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
          res.status(201).json({
            message: 'Article successfully updated',
            title: row[0].title,
            article: row[0].article,
          });
        })
        .catch((error) => {
          res.status(400).json({
            error,
          });
        });
    })
      .catch((error) => {
        res.status(400).json({
          error,
        });
      });
  },
};
