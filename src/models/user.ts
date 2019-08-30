import { Schema, model } from 'mongoose';

const UserSchema = new Schema({
  name: {
    type: String,
    require: true
  },
  email: {
    type: String,
    require: true,
    unique: true
  },
  password: {
    type: String,
    require: true
  },
  avatar: {
    type: String
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

const User = model('user', UserSchema);
export default User;
