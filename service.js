var jwt = require('jsonwebtoken');
const sceret = '$bilal@1234$'
function setuser(user){
const payload = {
    _id : user._id,
    email :user.email,
    username : user.username,
    role  :user.role
    };
  return jwt.sign(payload , sceret);  
}
function getUser(user){
  return jwt.verify(user ,sceret);
}


module.exports ={
    setuser,
    getUser
}