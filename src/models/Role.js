import { permission } from "process";
import pool from "../config/database";

const roleSchema = new pool.Schema({
  roleName: {
    type: String,
    required: true,
    unique: true,
  },
  Permissions: {
    type:String,
    required:true,
    },
});



const Role = pool.model('Role', roleSchema);

export default Role;