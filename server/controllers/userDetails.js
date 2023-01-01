import mongoose from 'mongoose';

const UserDetailsSchema = new mongoose.Schema(
  {
    fname: String,
    lname: String,
    email: {type: String, unique: true},
    password: String,
  }, 
  {
    collection: "UserInfo",
  }
);

const User = mongoose.model("UserInfo", UserDetailsSchema);

export default User;
