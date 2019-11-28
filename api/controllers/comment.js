const { pool } = require('../db/config');

module.exports = {
  createArticleComment(req, res) {
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

      pool.query(selectArticle).then((articleResponse) => {
        res.status(201).json({
          message: 'comment successfully created',
          createdOn: rows[0].created_at,
          articleTitle: articleResponse.rows[0].title,
          article: articleResponse.rows[0].article,
          comment: rows[0].comment,
        });
      })
        .catch((error) => {
          res.status(400).json({ error });
        });
    })
      .catch((error) => {
        res.status(400).json({ error });
      });
  },
  // createGifComment(req, res) {
  //   const { comment } = req.body;
  //   const { gifId } = req.params;
  //   const employeeId = req.employee.id;

  //   const insertComment = {
  //     name: 'insertComment',
  // eslint-disable-next-line max-len
  //     text: 'INSERT INTO gif_comment (comment, gif_id, employeeid) VALUES ($1, $2, $3) RETURNING *',
  //     values: [comment, gifId, employeeId],
  //   };

  //   pool.query(insertComment).then((response) => {
  //     const { rows } = response;
  //     const selectGif = {
  //       name: 'selectGif',
  //       text: 'SELECT * FROM gif WHERE id=$1',
  //       values: [rows[0].gif_id],
  //     };

  //     pool.query(selectGif).then((gifResponse) => {
  //       res.status(201).json({
  //         message: 'comment successfully created',
  //         createdOn: rows[0].created_at,
  //         gifTitle: gifResponse.rows[0].title,
  //         comment: rows[0].comment,
  //       });
  //     })
  //       .catch((error) => {
  //         res.status(400).json({ error });
  //       });
  //   })
  //     .catch((error) => {
  //       res.status(400).json({ error });
  //     });
  // },
};
