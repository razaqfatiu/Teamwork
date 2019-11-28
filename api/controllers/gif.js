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
      const uploader = rows[0].employeeid;

      if (!isAdmin && uploader !== signedInUser) {
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
              res.status(500).json({ error });
            });
        });
    })
      .catch((error) => {
        res.status(400).json({ error });
      });
  },
  // getOneGif(req, res) {
  //   const { gifId } = req.params;
  //   const selectGif = {
  //     name: 'selectGif',
  //     text: 'SELECT * FROM gif WHERE id=$1',
  //     values: [gifId],
  //   };
  //   const selectGifComment = {
  //     name: 'selectGifComment',
  // eslint-disable-next-line max-len
  //     text: 'SELECT id as "commentId", comment, employeeid as "authorId" FROM gif_comment WHERE gif_id=$1',
  //     values: [gifId],
  //   };

  //   pool.query(selectGifComment).then((response) => pool.query(selectGif).then((result) => {
  //     const { rows } = result;
  //     res.status(200).json({
  //       id: rows[0].id,
  //       createdOn: rows[0].created_at,
  //       title: rows[0].title,
  //       url: rows[0].imageurl,
  //       comments: response.rows,
  //     });
  //   })
  //     .catch((error) => res.status(400).json({ error })))
  //     .catch((error) => res.status(400).json({ error }));
  // },
};
