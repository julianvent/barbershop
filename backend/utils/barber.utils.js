
import { BASE_URL } from "../services/jwt.service.js";
export function generateImageUrl(relativePath) {
    return `${BASE_URL}${relativePath}`.replace(/\\/g, "/");
}
