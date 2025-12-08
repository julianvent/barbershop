
import { BASE_URL_BACKEND } from "../services/jwt.service.js";
export function generateImageUrl(relativePath) {
    if (relativePath == null)
        return null;
    return `${BASE_URL_BACKEND}${relativePath}`.replace(/\\/g, "/");
}
