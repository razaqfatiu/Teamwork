const { pool } = require('../db/config');

module.exports = {
  getFeeds(req, res) {
    const getFeed = {
      name: 'getFeed',
      text: `SELECT id, created_at as "createdOn", title, article as "article/url", employeeid as "authorId" FROM article 
      UNION
      SELECT id, created_at as "createdOn", title, imageurl as "url", employeeid as "authorId" FROM gif ORDER BY "createdOn" ASC`,
    };
    pool.query(getFeed).then((result) => {
      res.json({ result });
    })
      .catch((error) => { res.status(400).json({ error }); });
  },
};
