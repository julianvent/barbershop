
import { BASE_URL } from "../services/jwt.service.js";
export function generateImageUrl(relativePath) {
    if (relativePath == null)
        return null;
    return `${BASE_URL}${relativePath}`.replace(/\\/g, "/");
}
