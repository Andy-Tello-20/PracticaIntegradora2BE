import path from 'path';
import bcrypt from 'bcrypt';
import { fileURLToPath } from 'url';
import JWT from 'jsonwebtoken';

const __filename = fileURLToPath(import.meta.url);

export const __dirname = path.dirname(__filename);

export const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10));

export const isValidPassword = (bodyPassword, passwordDB) => bcrypt.compareSync( bodyPassword, passwordDB);

export const JWT_SECRET = 'qBvPkU2X;J1,51Z!~2p[JW.DT|g:4l@'

export const generateToken = (user) => {
  const payload = {
    id: user._id,
    first_name: user.first_name,
    last_name: user.last_name,
    email: user.email,
    age:user.age,
  };
  return JWT.sign(payload, JWT_SECRET, { expiresIn: '10m' });
};

