import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET || 'keviiiiiin';
const EXPIRES_IN = process.env.JWT_EXPIRES || '1d';

export function signAccessToken(payload, opts = {}) {
  return jwt.sign(payload, SECRET, { expiresIn: EXPIRES_IN, ...opts });
}

export function verifyToken(token) {
  return jwt.verify(token, SECRET); 
}
