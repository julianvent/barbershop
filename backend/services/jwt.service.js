import jwt from 'jsonwebtoken';

const ACCESS_TOKEN_SECRET  = process.env.JWT_SECRET || 'a2V2aWlpaWlpbg==';
const ACCESS_TOKEN_EXPIRES_IN  = process.env.JWT_EXPIRES || '1d';
const SIGNED_URL_SECRET = process.env.SIGNED_URL_SECRET || 'a2V2aWlpaWlpbjI='
const SIGNED_URL_EXPIRES_IN = process.env.SIGNED_URL_EXPIRES_IN || '30d'
const BASE_URL = process.env.BASE_URL || "https://sagozbarberdev.com";

export function signAccessToken(payload, opts = {}) {
  return jwt.sign(
            payload,
            ACCESS_TOKEN_SECRET ,
            { expiresIn: ACCESS_TOKEN_EXPIRES_IN, ...opts }
          );
}

export function verifyToken(token) {
  try {
    const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET);
    return decoded;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error("Token expired");
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw new Error("Invalid token");
    }
    if (error instanceof jwt.NotBeforeError) {
      throw new Error("Token not active yet");
    }
    throw error;
  }
}

export function generateAppointmentLink(appointmentId){
  const token = jwt.sign(
    { appointmentId },
    SIGNED_URL_SECRET,
    { expiresIn: SIGNED_URL_EXPIRES_IN }
  );

  return `${BASE_URL}/appointments/${appointmentId}?auth=${token}`;
}
export function verifyTokenAppointment(token) {
  try {
    const decoded = jwt.verify(token, SIGNED_URL_SECRET);
    return decoded;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error("Token expired");
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw new Error("Invalid token");
    }
    if (error instanceof jwt.NotBeforeError) {
      throw new Error("Token not active yet");
    }
    throw error;
  }
}