import { BASE_URL_BACKEND } from "../services/jwt.service.js";

export function generateImageUrl(imagePath) {
  if (!imagePath) return null;
  return `${BASE_URL_BACKEND}${imagePath}`.replace(/\\/g, "/");
}
