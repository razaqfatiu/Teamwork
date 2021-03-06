const { body, validationResult } = require('express-validator');
const cloudinary = require('../config/cloudinary');
const { pool } = require('../db/config');

module.exports = {
  gifInputValidation: [
    body('title', 'Title field cannot be empty').trim()
      .not().isEmpty(),
    body('image', 'gif image here').trim()
      .not()
      .isEmpty(),
  ],
  // eslint-disable-next-line consistent-return
  createGif(req, res) {
    const image = req.file.path;
    const { title } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
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

          return res.status(201).json({
            gifId: rows[0].id,
            message: 'GIF image successfully posted',
            createdOn,
            title: rows[0].title,
            imageUrl: rows[0].image_url,
          });
        })
          .catch((error) => res.status(500).json({
            error,
          }));
      });
  },
  deleteGif(req, res) {
    const { gifId } = req.params;
    const { id: signedInUser, isAdmin } = req.user;

    const getGifInfo = {
      name: 'getGifInfo',
      text: 'SELECT name,author_id,public_id FROM gif WHERE id=$1',
      values: [gifId],
    };
    pool.query(getGifInfo).then((data) => {
      const { rows } = data;
      const publicId = rows[0].public_id;
      const author = rows[0].author_id;
      if (rows.length === 0) {
        return res.status(404).json({
          error: 'Cannot find Gif Image',
        });
      }
      if (!isAdmin && author !== signedInUser) {
        return res.status(401).json({
          message: 'You are not authorized to delete this file',
        });
      }
      const removeGif = {
        name: 'removeGif',
        text: 'DELETE FROM gif WHERE id = $1',
        values: [gifId],
      };
      return cloudinary.uploader.destroy(publicId,
        {
          folder: 'samples/gifs',
        },
        (err) => {
          if (err) {
            return res.status(500).json({
              err,
            });
          }
          return pool.query(removeGif).then(() => res.status(200).json({
            message: 'Gif post successfully deleted',
          }))
            .catch((error) => {
              res.status(400).json({ error });
            });
        });
    })
      .catch((error) => {
        res.status(500).json({ error });
      });
  },
  getOneGif(req, res) {
    const { gifId } = req.params;
    const selectGif = {
      name: 'selectGif',
      text: 'SELECT * FROM gif WHERE id=$1',
      values: [gifId],
    };
    const selectGifComment = {
      name: 'selectGifComment',
      text: 'SELECT id as "commentId", comment, author_id as "authorId" FROM gif_comment WHERE gif_id=$1',
      values: [gifId],
    };

    pool.query(selectGifComment).then((response) => pool.query(selectGif).then((result) => {
      const { rows } = result;
      if (rows.length < 1) return res.status(404).json({ error: 'Not Found' });
      return res.status(200).json({
        id: rows[0].id,
        createdOn: rows[0].created_at,
        title: rows[0].title,
        url: rows[0].image_url,
        comments: response.rows,
      });
    })
      .catch((error) => res.status(400).json({ error })))
      .catch((error) => res.status(500).json({ error }));
  },
};
