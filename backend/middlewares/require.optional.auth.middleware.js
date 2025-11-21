import { verifyToken } from "../services/jwt.service.js";

export default function requireOptionalAuth(req, res, next) {
    try {
        const authHeader = req.headers['authorization'];

        if (!authHeader) {
            req.user = null;
            return next();
        }

        const token = authHeader.startsWith("Bearer ")? authHeader.split(" ")[1]: authHeader;
        const decoded = verifyToken(token);

        req.user = decoded;
        return next();

    } catch (error) {
        req.user = null;
        return next();
    }
}
