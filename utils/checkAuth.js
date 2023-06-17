const jwt = require('jsonwebtoken');

const checkAuth = (req, res, next) => {
  const token = (req.headers.authorization || '').replace(/Bearer\s?/, '');

  if (token) {
    try {
      const decoded = jwt.verify(token, 'secret123');

      req.userId = decoded._id;
      next();
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        message: 'Failed',
      });
    }
  } else {
    return res.status(500).json({
      message: 'Failed',
    });
  }
};

module.exports = checkAuth;
