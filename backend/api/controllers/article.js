const { pool } = require('../db/config');

module.exports = {
  createArticle(req, res) {
    const { title, article } = req.body;
    const employeeid = req.employee.id;
    const newArticle = {
      name: 'newArticle',
      text: 'INSERT INTO article (title, article, employeeid) VALUES ($1, $2, $3)  RETURNING *',
      values: [title, article, employeeid],
    };

    pool.query(newArticle).then((response) => {
      const { rows } = response;
      const { id } = rows[0];
      res.status(201).json({
        message: 'Article successfully posted',
        articleId: id,
        createdOn: rows[0].created_at,
        title: rows[0].title,
      });
    })
      .catch((error) => {
        console.log(error);
        res.status(400).json({ error });
      });
  },

  editArticle(req, res) {
    const { title, article } = req.body;
    const { id } = req.params;

    const updateArticle = {
      name: 'updateArticle',
      text: 'UPDATE article SET title = $1, article = $2 WHERE id=$3 RETURNING *',
      values: [title, article, id],
    };
    pool.query(updateArticle)
      .then((response) => {
        const { rows } = response;
        res.status(201).json({
          message: 'Article successfully updated',
          title: rows[0].title,
          article: rows[0].article,
        });
      })
      .catch((error) => {
        res.status(400).json({
          error,
        });
      });
  },
  deleteArticle(req, res) {
    const { id } = req.params;
    const deleteArticle = {
      name: 'deleteArticle',
      text: 'DELETE FROM article WHERE id = $1',
      values: [id],
    };
    pool.query(deleteArticle).then(() => {
      res.status(200).json({ message: 'Article Successfully deleted' });
    })
      .catch((error) => { res.status(400).json({ error }); });
  },
};
