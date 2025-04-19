const { getUser } = require("../service");

const checkAuth = async (req, res, next) => {
  const token = req.cookies.token;
  req.user = null; //  Token nahi hai to user null set karo

  if (!token) {
    return next();
  }
 const user = getUser(token);
  req.user = user;
  return next();
};
const checkAuthorization  = (roles = [] ) => {
  return function (req ,res ,next) {
    if(!req.user) 
      return res.redirect('/');

    if(!roles.includes(req.user.role))
      return res.end('unAuthorized')

    return next();
  }
}

module.exports = {
  checkAuth,
  checkAuthorization,
};
