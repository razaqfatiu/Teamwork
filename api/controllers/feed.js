const { pool } = require('../db/config');

module.exports = {
  getFeeds(req, res) {
    const getFeed = {
      name: 'getFeed',
      text: `SELECT id, created_at as "createdOn", title, article, NULL as image_url, author_id as "authorId" FROM article 
      UNION ALL
      SELECT id, created_at as "createdOn", title, NULL as article, image_url as "url", author_id as "authorId" FROM gif ORDER BY "createdOn" ASC`,
    };
    pool.query(getFeed).then((result) => {
      if (result.rows.length < 1) return res.status(404).json({ error: 'Not Found' });
      return res.status(200).json({ data: result.rows });
    })
      .catch((error) => { res.status(500).json({ error }); });
  },
};
