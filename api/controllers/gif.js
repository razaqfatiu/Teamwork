const cloudinary = require('../config/cloudinary');
const { pool } = require('../db/config');

module.exports = {
  createGif(req, res) {
    const gif = req.file.path;
    const { title } = req.body;
    const userId = req.user.id;
    console.log(userId);
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
          text: 'INSERT INTO gif (name, title, imageurl, public_id, employeeid) VALUES ($1, $2, $3, $4, $5) RETURNING *',
          values: [result.original_filename, title, result.url, result.public_id, userId],
        };
        return pool.query(insertGif).then((response) => {
          const { rows } = response;
          res.status(201).json({
            gifId: rows[0].id,
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
  deleteGif(req, res) {
    const { id } = req.params;
    const signedInEmployee = req.employee.id;
    let uploader;
    let publicId;

    const getGifInfo = {
      name: 'getGifInfo',
      text: 'SELECT name,employeeid,public_id FROM gif WHERE id=$1',
      values: [id],
    };
    pool.query(getGifInfo).then((result) => result).then((data) => {
      const { rows } = data;
      publicId = rows[0].public_id;
      uploader = rows[0].employeeid;

      if (uploader !== signedInEmployee) {
        return res.status(401).json({
          message: 'You are not authorized to delete this file',
        });
      }
      const removeGif = {
        name: 'removeGif',
        text: 'DELETE FROM gif WHERE id = $1',
        values: [id],
      };
      return cloudinary.uploader.destroy(publicId,
        {
          folder: 'samples/gifs',
        },
        (err) => {
          if (err) {
            return res.status(400).json({
              err,
            });
          }
          return pool.query(removeGif).then(() => res.status(200).json({
            message: 'gif post successfully deleted',
          }))
            .catch((error) => {
              res.status(400).json({ error });
            });
        });
    })
      .catch((error) => {
        res.status(400).json({ error });
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
      text: 'SELECT id as "commentId", comment, employeeid as "authorId" FROM gif_comment WHERE gif_id=$1',
      values: [gifId],
    };

    pool.query(selectGifComment).then((response) => pool.query(selectGif).then((result) => {
      const { rows } = result;
      res.status(200).json({
        id: rows[0].id,
        createdOn: rows[0].created_at,
        title: rows[0].title,
        url: rows[0].imageurl,
        comments: response.rows,
      });
    })
      .catch((error) => res.status(400).json({ error })))
      .catch((error) => res.status(400).json({ error }));
  },
};
