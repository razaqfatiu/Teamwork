require('dotenv').config();
const jwt = require('jsonwebtoken');

exports.adminAuth = (req, res, next) => {
  try{
    const token = req.headers.authorization.split(' ')[1];
    const decoedToken = jwt.verify( token, process.env.TOKEN_SECRET);
    const adminId = decoedToken.adminId;
    if(req.body.adminId &&  req.body.adminId !== adminId){
       throw "Invalid user id"
    }
    else{
      next()
    }

  }
  catch{
    res.status(401).json({
      error: new Error('Invaid request')
    })
  }
}