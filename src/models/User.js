import pool from "../config/database";

const userSchema = new pool.Schema({
  name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  
  role: {
    type: pool.Schema.Types.ObjectId,
    ref: 'Role',
    required: true,
  
  },
});

const User = pool.model('User', userSchema);
export default User;