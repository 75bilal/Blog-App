const mongoose = require("mongoose");
const { createHmac , randomBytes } = require('crypto');
const { setuser } =require('../service')
const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    salt : {
      type: String,
      required: false,
    },
    password: {
      type: String,
      required: true,
      unique: true,
    },
    profileImageUrl :{
      type: String,
      default :  '/images/default.svg',
    },
    role :{
      type: String,
      enum : ['USER' , 'ADMIN'],
      default : 'USER',
    },

  },
  { timestamps: true }
);

UserSchema.pre('save', function(next) {
  const user = this;
  
  if(!user.isModified('password')) return next();
  
  const salt = randomBytes(16).toString();
  const hashpassword = createHmac('sha256', salt)
    .update(user.password)
    .digest('hex');
  
  this.salt = salt;
  this.password = hashpassword;
  next();
});

UserSchema.static('matchPassword' , async function(email,password){
  const user = await this.findOne({ email });
 if(!user) throw new Error('User not Found') ;

    const salt = user.salt;
    const hashedpassword = user.password;
    const  userProvidedHashed= createHmac('sha256', salt)
    .update(password)
    .digest('hex');


    if(hashedpassword !== userProvidedHashed){
       throw new Error('Incorrect password');
    }
    const token = setuser(user);
    return token;
 
})


const user =mongoose.model('user' ,UserSchema);

module.exports = user;