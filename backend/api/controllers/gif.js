const cloudinary = require('../config/cloudinary');
const { pool } = require('../db/config');

module.exports = {
  createGif(req, res) {
    const gif = req.file.path;
    const { title } = req.body;
    const employeeid = req.employee.id;
    cloudinary.uploader.upload(gif,
      {
        use_filename: true,
        unique_filename: false,
        folder: 'samples/gifs',
      },
      (err, result) => {
        if (err) {
          return res.status(400).json({
            err,
          });
        }
        const insertGif = {
          name: 'insertGif',
          text: 'INSERT INTO gif (name, title, imageurl, employeeid) VALUES ($1, $2, $3, $4) RETURNING *',
          values: [result.original_filename, title, result.url, employeeid],
        };
        return pool.query(insertGif).then((response) => {
          const { rows } = response;
          res.json({
            message: 'GIF image successfully posted',
            createdOn: rows[0].created_at,
            title: rows[0].title,
            imageUrl: rows[0].imageurl,
          });
        })
          .catch((error) => {
            res.status(400).json({
              error,
            });
          });
      });
  },
};
