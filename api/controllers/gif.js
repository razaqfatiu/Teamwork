const cloudinary = require('../config/cloudinary');
const { pool } = require('../db/config');

module.exports = {
  createGif(req, res) {
    const image = req.file.path;
    const { title } = req.body;
    const userId = req.user.id;
    cloudinary.uploader.upload(image,
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
          text: 'INSERT INTO gif (name, title, image_url, public_id, author_id) VALUES ($1, $2, $3, $4, $5) RETURNING *',
          values: [result.original_filename, title, result.url, result.public_id, userId],
        };
        return pool.query(insertGif).then((response) => {
          const { rows } = response;
          const createdOn = new Date(rows[0].created_at);

          res.status(201).json({
            gifId: rows[0].id,
            message: 'GIF image successfully posted',
            createdOn,
            title: rows[0].title,
            imageUrl: rows[0].image_url,
          });
        })
          .catch((error) => {
            res.status(500).json({
              error,
            });
          });
      });
  },
};
