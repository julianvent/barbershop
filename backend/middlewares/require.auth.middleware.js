import { verifyToken } from "../services/jwt.service.js";

export default function requireAuth(req, res, next) {
    try {
        const authHeader = req.headers['authorization'];

        if (!authHeader) {
            return res.status(401).json({
                message: "No token provided"
            });
        }

        const token = authHeader.startsWith("Bearer ")? authHeader.split(" ")[1]: authHeader;
        const decoded = verifyToken(token);

        req.user = decoded;
        return next();

    } catch (error) {
        return res.status(401).json({
            message: "Invalid or expired token"
        });
    }
}
